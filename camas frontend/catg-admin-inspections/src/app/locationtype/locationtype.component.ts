import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-locationtype',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './locationtype.component.html',
  styleUrls: ['./locationtype.component.css']
})
export class LocationtypeComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  locationTypeForm: FormGroup;
  modalTitle: string = 'Add New Location Type';
  isEditMode: boolean = false;
  editingLocationType: any = null;
  searchText: string = '';
  locationTypeList: any[] = [];
  filteredLocationTypeList: any[] = [];
  categoryList: any[] = []; // Store categories

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.locationTypeForm = this.fb.group({
      contract_location_type: ['', Validators.required],
      categoryname: ['', Validators.required] // New form control for category
    });
  }

  ngOnInit() {
    this.getLocationTypes();
    this.getCategoryTypes(); // Fetch categories on init
  }

  getLocationTypes() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });

    this.apicall.getLocationType(data).subscribe({
      next: (res: any) => {
        this.locationTypeList = res;
        this.filteredLocationTypeList = [...this.locationTypeList];
      },
      error: (err) => {
        console.error('Error fetching location types:', err);
        alert('Failed to fetch location types. Please try again.');
      }
    });
  }

  getCategoryTypes() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });

    this.apicall.getCategory(data).subscribe({
      next: (res: any) => {
        //console.log('Category Response:', res); // Added console log
        this.categoryList = res; // Store categories
      },
      error: (err) => {
        console.error('Error fetching category types:', err);
        alert('Failed to fetch category types. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.locationTypeForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      contract_location_type: this.locationTypeForm.get('contract_location_type')?.value,
      contract_category: this.locationTypeForm.get('categoryname')?.value, // Include category ID
      id: this.isEditMode ? this.editingLocationType.id : null,
    };
//console.log('Form Data being sent:', formData); // Added console log
    if (this.isEditMode) {
      this.apicall.updateLocationType(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getLocationTypes();
          this.modalService.dismissAll();
          alert('Location Type updated successfully!');
        },
        error: (err) => {
          console.error('Error updating location type:', err);
          alert('Failed to update location type. Please try again.');
        }
      });
    } else {
      this.apicall.insertLocationType(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getLocationTypes();
          this.modalService.dismissAll();
          alert('Location Type added successfully!');
        },
        error: (err) => {
          console.error('Error adding location type:', err);
          alert('Failed to add location type. Please try again.');
        }
      });
    }
  }

  deleteType(locationtype: any): void {
    if (confirm(`Are you sure you want to delete location type "${locationtype.contract_location_type}"?`)) {
      const data = {
        id: locationtype.id,
        zone: localStorage.getItem('zone') || 'SCR',
        division: localStorage.getItem('division') || 'BZA'
      };

      this.apicall.deleteLocationType(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getLocationTypes();
          alert('Location Type deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting location type:', err);
          alert('Failed to delete location type. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterTypes(): void {
    if (!this.searchText) {
      this.filteredLocationTypeList = [...this.locationTypeList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredLocationTypeList = this.locationTypeList.filter(locationType =>
      locationType.contract_location_type?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Location Type';
    this.isEditMode = false;
    this.editingLocationType = null;
    this.locationTypeForm.reset();

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editType(locationtype: any): void {
    this.locationTypeForm.patchValue({
      contract_location_type: locationtype.contract_location_type,
      categoryname: locationtype.contract_category // Patch category ID
    });

    this.modalTitle = 'Edit Location Type';
    this.isEditMode = true;
    this.editingLocationType = locationtype;

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}