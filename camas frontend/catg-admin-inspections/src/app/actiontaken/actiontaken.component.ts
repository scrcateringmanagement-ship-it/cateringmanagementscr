import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-actiontaken',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './actiontaken.component.html',
  styleUrls: ['./actiontaken.component.css']
})
export class ActionTakenComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  actionTakenForm: FormGroup;
  modalTitle: string = 'Add New Action Taken';
  isEditMode: boolean = false;
  editingActionTaken: any = null;
  searchText: string = '';
  actionTakenList: any[] = [];
  filteredActionTakenList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.actionTakenForm = this.fb.group({
      actiontaken: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getActionsTaken();
  }

  getActionsTaken() {
    this.apicall.getActionTaken().subscribe({
      next: (res: any) => {
     //   //console.log(res);
        this.actionTakenList = res;
        this.filteredActionTakenList = [...this.actionTakenList];
      },
      error: (err) => {
        console.error('Error fetching actions taken:', err);
        alert('Failed to fetch actions taken. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.actionTakenForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      actiontaken: this.actionTakenForm.get('actiontaken')?.value,
      id: this.isEditMode ? this.editingActionTaken.id : null,
    };
   // //console.log(formData);

    if (this.isEditMode) {
      this.apicall.updateActionTaken(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
      //    //console.log(res);
          this.getActionsTaken();
          this.modalService.dismissAll();
          alert('Action taken updated successfully!');
        },
        error: (err) => {
          console.error('Error updating action taken:', err);
          alert('Failed to update action taken. Please try again.');
        }
      });
    } else {
      this.apicall.insertActionTaken(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getActionsTaken();
          this.modalService.dismissAll();
          alert('Action taken added successfully!');
        },
        error: (err) => {
          console.error('Error adding action taken:', err);
          alert('Failed to add action taken. Please try again.');
        }
      });
    }
  }

  deleteActionTaken(action: any): void {
    if (confirm(`Are you sure you want to delete action taken "${action.actiontaken}"?`)) {
      const data = {
        id: action.id,
      };

      this.apicall.deleteActionTaken(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getActionsTaken();
          alert('Action taken deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting action taken:', err);
          alert('Failed to delete action taken. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterActionsTaken(): void {
    if (!this.searchText) {
      this.filteredActionTakenList = [...this.actionTakenList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredActionTakenList = this.actionTakenList.filter(action =>
      action.actiontaken?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Action Taken';
    this.isEditMode = false;
    this.editingActionTaken = null;
    this.actionTakenForm.reset();

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editActionTaken(action: any): void {
    this.actionTakenForm.patchValue({
      actiontaken: action.actiontaken
    });

    this.modalTitle = 'Edit Action Taken';
    this.isEditMode = true;
    this.editingActionTaken = action;

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}