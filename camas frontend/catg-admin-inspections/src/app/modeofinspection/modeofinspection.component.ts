import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-modeofinspection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './modeofinspection.component.html',
  styleUrls: ['./modeofinspection.component.css']
})
export class ModeOfInspectionComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  modeOfInspectionForm: FormGroup;
  modalTitle: string = 'Add New Mode of Inspection';
  isEditMode: boolean = false;
  editingModeOfInspection: any = null;
  searchText: string = '';
  modeOfInspectionList: any[] = [];
  filteredModeOfInspectionList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.modeOfInspectionForm = this.fb.group({
      modeofinspection: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getModesOfInspection();
  }

  getModesOfInspection() {
    this.apicall.getModeOfInspection().subscribe({
      next: (res: any) => {
        //console.log(res);
        this.modeOfInspectionList = res;
        this.filteredModeOfInspectionList = [...this.modeOfInspectionList];
      },
      error: (err) => {
        console.error('Error fetching modes of inspection:', err);
        alert('Failed to fetch modes of inspection. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.modeOfInspectionForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      modeofinspection: this.modeOfInspectionForm.get('modeofinspection')?.value,
      id: this.isEditMode ? this.editingModeOfInspection.id : null,
    };
    //console.log(formData);

    if (this.isEditMode) {
      this.apicall.updateModeOfInspection(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          //console.log(res);
          this.getModesOfInspection();
          this.modalService.dismissAll();
          alert('Mode of inspection updated successfully!');
        },
        error: (err) => {
          console.error('Error updating mode of inspection:', err);
          alert('Failed to update mode of inspection. Please try again.');
        }
      });
    } else {
      this.apicall.insertModeOfInspection(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getModesOfInspection();
          this.modalService.dismissAll();
          alert('Mode of inspection added successfully!');
        },
        error: (err) => {
          console.error('Error adding mode of inspection:', err);
          alert('Failed to add mode of inspection. Please try again.');
        }
      });
    }
  }

  deleteModeOfInspection(mode: any): void {
    if (confirm(`Are you sure you want to delete mode of inspection "${mode.modeofinspection}"?`)) {
      const data = {
        id: mode.id,
      };

      this.apicall.deleteModeOfInspection(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getModesOfInspection();
          alert('Mode of inspection deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting mode of inspection:', err);
          alert('Failed to delete mode of inspection. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterModesOfInspection(): void {
    if (!this.searchText) {
      this.filteredModeOfInspectionList = [...this.modeOfInspectionList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredModeOfInspectionList = this.modeOfInspectionList.filter(mode =>
      mode.modeofinspection?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Mode of Inspection';
    this.isEditMode = false;
    this.editingModeOfInspection = null;
    this.modeOfInspectionForm.reset();

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editModeOfInspection(mode: any): void {
    this.modeOfInspectionForm.patchValue({
      modeofinspection: mode.modeofinspection
    });

    this.modalTitle = 'Edit Mode of Inspection';
    this.isEditMode = true;
    this.editingModeOfInspection = mode;

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}