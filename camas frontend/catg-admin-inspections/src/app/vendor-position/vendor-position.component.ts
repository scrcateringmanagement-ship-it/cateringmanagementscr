import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-vendor-position',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './vendor-position.component.html',
  styleUrls: ['./vendor-position.component.css']
})
export class VendorPositionComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  vendorPositionForm: FormGroup;
  modalTitle: string = 'Add New Vendor Position';
  isEditMode: boolean = false;
  editingVendorPosition: any = null;
  searchText: string = '';
  vendorPositionList: any[] = [];
  filteredVendorPositionList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.vendorPositionForm = this.fb.group({
      vendorPositionName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getVendorPositions();
  }

  getVendorPositions() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });

    this.apicall.getVendorPosition(data).subscribe({
      next: (res: any) => {
        //console.log(res);
        this.vendorPositionList = res;
        this.filteredVendorPositionList = [...this.vendorPositionList];
      },
      error: (err) => {
        console.error('Error fetching vendor positions:', err);
        alert('Failed to fetch vendor positions. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.vendorPositionForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      vendorPositionName: this.vendorPositionForm.get('vendorPositionName')?.value,
      id: this.isEditMode ? this.editingVendorPosition.id : null,
    };

    if (this.isEditMode) {
      this.apicall.updateVendorPosition(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          //console.log(res);
          this.getVendorPositions();
          this.modalService.dismissAll();
          alert('Vendor position updated successfully!');
        },
        error: (err) => {
          console.error('Error updating vendor position:', err);
          alert('Failed to update vendor position. Please try again.');
        }
      });
    } else {
      this.apicall.insertVendorPosition(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getVendorPositions();
          this.modalService.dismissAll();
          alert('Vendor position added successfully!');
        },
        error: (err) => {
          console.error('Error adding vendor position:', err);
          alert('Failed to add vendor position. Please try again.');
        }
      });
    }
  }

  deleteVendorPosition(vendorPosition: any): void {
    if (confirm(`Are you sure you want to delete vendor position "${vendorPosition.vendorPositionName}"?`)) {
      const data = {
        id: vendorPosition.id,
        zone: localStorage.getItem('zone') || 'SCR',
        division: localStorage.getItem('division') || 'BZA'
      };

      this.apicall.deleteVendorPosition(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getVendorPositions();
          alert('Vendor position deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting vendor position:', err);
          alert('Failed to delete vendor position. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterVendorPositions(): void {
    if (!this.searchText) {
      this.filteredVendorPositionList = [...this.vendorPositionList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredVendorPositionList = this.vendorPositionList.filter(vendorPosition =>
      vendorPosition.vendorPositionName?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Vendor Position';
    this.isEditMode = false;
    this.editingVendorPosition = null;
    this.vendorPositionForm.reset();

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editVendorPosition(vendorPosition: any): void {
    this.vendorPositionForm.patchValue({
      vendorPositionName: vendorPosition.vendorPositionName
    });

    this.modalTitle = 'Edit Vendor Position';
    this.isEditMode = true;
    this.editingVendorPosition = vendorPosition;

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}