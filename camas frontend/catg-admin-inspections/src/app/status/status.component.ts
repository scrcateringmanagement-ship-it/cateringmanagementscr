import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  statusForm: FormGroup;
  modalTitle: string = 'Add New Status';
  isEditMode: boolean = false;
  editingStatus: any = null;
  searchText: string = '';
  statusList: any[] = [];
  filteredStatusList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required]  // Changed from statusname to status
    });
  }

  ngOnInit() {
    this.getStatuses();
  }

  getStatuses() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });
    
    this.apicall.getStatus(data).subscribe({
      next: (res: any) => {
        this.statusList = res;
        this.filteredStatusList = [...this.statusList];
      },
      error: (err) => {
        console.error('Error fetching statuses:', err);
        alert('Failed to fetch statuses. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.statusForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      status: this.statusForm.get('status')?.value,  // Changed from statusname
      id: this.isEditMode ? this.editingStatus.id : null,
    };

    if (this.isEditMode) {
      this.apicall.updateStatus(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getStatuses();
          this.modalService.dismissAll();
          alert('Status updated successfully!');
        },
        error: (err) => {
          console.error('Error updating status:', err);
          alert('Failed to update status. Please try again.');
        }
      });
    } else {
      this.apicall.insertStatus(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getStatuses();
          this.modalService.dismissAll();
          alert('Status added successfully!');
        },
        error: (err) => {
          console.error('Error adding status:', err);
          alert('Failed to add status. Please try again.');
        }
      });
    }
  }

  deleteStatus(status: any): void {
    if (confirm(`Are you sure you want to delete status "${status.status}"?`)) {  // Changed from statusname
      const data = {
        id: status.id,
      };
      
      this.apicall.deleteStatus(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getStatuses();
          alert('Status deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting status:', err);
          alert('Failed to delete status. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterStatuses(): void {
    if (!this.searchText) {
      this.filteredStatusList = [...this.statusList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredStatusList = this.statusList.filter(status =>
      status.status?.toLowerCase().includes(searchTerm)  // Changed from statusname
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Status';
    this.isEditMode = false;
    this.editingStatus = null;
    this.statusForm.reset();
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editStatus(status: any): void {
    this.statusForm.patchValue({
      status: status.status
    });
    
    this.modalTitle = 'Edit Status';
    this.isEditMode = true;
    this.editingStatus = status;
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}
