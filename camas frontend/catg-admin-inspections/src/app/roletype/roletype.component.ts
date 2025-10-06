import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-roletype',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './roletype.component.html',
  styleUrl: './roletype.component.css'
})
export class RoletypeComponent implements OnInit {
    @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  roletypeForm: FormGroup;
  modalTitle: string = 'Add New Role Type';
  isEditMode: boolean = false;
  editingRoletype: any = null;
  searchText: string = '';
  roletypeList: any[] = [];
  filteredRoletypeList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.roletypeForm = this.fb.group({
      roletypename: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getRoletypes();
  }

  getRoletypes() {
    const data = JSON.stringify({
    });
    
    this.apicall.getRoletype(data).subscribe({
      next: (res: any) => {
        this.roletypeList = res;
        this.filteredRoletypeList = [...this.roletypeList];
      },
      error: (err) => {
        console.error('Error fetching Role types:', err);
        alert('Failed to fetch Role types. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.roletypeForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      ...this.roletypeForm.value,
      id: this.isEditMode ? this.editingRoletype.id : null,
    };

    if (this.isEditMode) {
      this.apicall.updateRoletype(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getRoletypes();
          this.modalService.dismissAll();
          alert('Role type updated successfully!');
        },
        error: (err) => {
          console.error('Error updating Role type:', err);
          alert('Failed to update Role type. Please try again.');
        }
      });
    } else {
      this.apicall.insertRoletype(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          //console.log('Insert Response:', res);  // Added console log
          this.getRoletypes();
          this.modalService.dismissAll();
          alert('Role type added successfully!');
        },
        error: (err) => {
          console.error('Error adding Role type:', err);
          alert('Failed to add Role type. Please try again.');
        }
      });
    }
  }

  deleteRoletype(roletype: any): void {
    if (confirm(`Are you sure you want to delete role type "${roletype.roletypename}"?`)) {
      const data = {
        id: roletype.id,
      };
      //console.log('id: ', data.id);  // Added console log
      this.apicall.deleteRoletype(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getRoletypes();
          alert('Role type deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting Role type:', err);
          alert('Failed to delete Role type. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterRoletypes(): void {
    if (!this.searchText) {
      this.filteredRoletypeList = [...this.roletypeList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredRoletypeList = this.roletypeList.filter(roletype =>
      roletype.roletypename?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Role Type';
    this.isEditMode = false;
    this.editingRoletype = null;
    this.roletypeForm.reset();
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editRoletype(roletype: any): void {
    this.roletypeForm.patchValue({
      roletypename: roletype.roletypename
    });
    
    this.modalTitle = 'Edit Role Type';
    this.isEditMode = true;
    this.editingRoletype = roletype;
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}
