import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-usertype',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './usertype.component.html',
  styleUrl: './usertype.component.css'
})
export class UsertypeComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  usertypeForm: FormGroup;
  modalTitle: string = 'Add New User Type';
  isEditMode: boolean = false;
  editingUsertype: any = null;
  searchText: string = '';
  usertypeList: any[] = [];
  filteredUsertypeList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.usertypeForm = this.fb.group({
      usertypename: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getUsertypes();
  }

  getUsertypes() {
    const data = JSON.stringify({
    });
    
    this.apicall.getUsertype(data).subscribe({
      next: (res: any) => {
        this.usertypeList = res;
        this.filteredUsertypeList = [...this.usertypeList];
      },
      error: (err) => {
        console.error('Error fetching user types:', err);
        alert('Failed to fetch user types. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.usertypeForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      ...this.usertypeForm.value,
      id: this.isEditMode ? this.editingUsertype.id : null,
    };

    if (this.isEditMode) {
      this.apicall.updateUsertype(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getUsertypes();
          this.modalService.dismissAll();
          alert('User type updated successfully!');
        },
        error: (err) => {
          console.error('Error updating user type:', err);
          alert('Failed to update user type. Please try again.');
        }
      });
    } else {
      this.apicall.insertUsertype(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          //console.log('Insert Response:', res);  // Added console log
          this.getUsertypes();
          this.modalService.dismissAll();
          alert('User type added successfully!');
        },
        error: (err) => {
          console.error('Error adding user type:', err);
          alert('Failed to add user type. Please try again.');
        }
      });
    }
  }

  deleteUsertype(usertype: any): void {
    if (confirm(`Are you sure you want to delete user type "${usertype.usertypename}"?`)) {
      const data = {
        id: usertype.id,
      };
      //console.log('id: ', data.id);  // Added console log
      this.apicall.deleteUsertype(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getUsertypes();
          alert('User type deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting user type:', err);
          alert('Failed to delete user type. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterUsertypes(): void {
    if (!this.searchText) {
      this.filteredUsertypeList = [...this.usertypeList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredUsertypeList = this.usertypeList.filter(usertype =>
      usertype.usertypename?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New User Type';
    this.isEditMode = false;
    this.editingUsertype = null;
    this.usertypeForm.reset();
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editUsertype(usertype: any): void {
    this.usertypeForm.patchValue({
      usertypename: usertype.usertypename
    });
    
    this.modalTitle = 'Edit User Type';
    this.isEditMode = true;
    this.editingUsertype = usertype;
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}
