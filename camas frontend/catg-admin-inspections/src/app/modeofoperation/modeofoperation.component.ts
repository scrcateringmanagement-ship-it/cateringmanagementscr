import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';


@Component({
  selector: 'app-modeofoperation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './modeofoperation.component.html',
  styleUrl: './modeofoperation.component.css'
})
export class ModeofoperationComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  modeForm: FormGroup;
  modalTitle: string = 'Add New Mode of Operation';
  isEditMode: boolean = false;
  editingMode: any = null;
  searchText: string = '';
  modeList: any[] = [];
  filteredModeList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.modeForm = this.fb.group({
      modeofoperation: ['', Validators.required]  // Changed from modename to modeofoperation
    });
  }

  ngOnInit() {
    this.getModes();
  }

  getModes() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });
  
    this.apicall.getModeOfOperation(data).subscribe({
      next: (res: any) => {
        //console.log('Modes:', res);
        // Flatten the nested array structure
        this.modeList = res.flat();
        this.filteredModeList = [...this.modeList];
      },
      error: (err) => {
        console.error('Error fetching modes:', err);
        alert('Failed to fetch modes. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.modeForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      modeofoperation: this.modeForm.get('modeofoperation')?.value,  // Changed from modename
      id: this.isEditMode ? this.editingMode.id : null,
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    };

    if (this.isEditMode) {
      this.apicall.updateModeOfOperation(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getModes();
          this.modalService.dismissAll();
          alert('Mode of Operation updated successfully!');
        },
        error: (err) => {
          console.error('Error updating mode:', err);
          alert('Failed to update mode. Please try again.');
        }
      });
    } else {
      this.apicall.insertModeOfOperation(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getModes();
          this.modalService.dismissAll();
          alert('Mode of Operation added successfully!');
        },
        error: (err) => {
          console.error('Error adding mode:', err);
          alert('Failed to add mode. Please try again.');
        }
      });
    }
  }

  deleteMode(mode: any): void {
    if (confirm(`Are you sure you want to delete mode "${mode.modeofoperation}"?`)) {  // Changed from modename
      const data = {
        id: mode.id,
      };
      
      this.apicall.deleteModeOfOperation(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getModes();
          alert('Mode of Operation deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting mode:', err);
          alert('Failed to delete mode. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterModes(): void {
    if (!this.searchText) {
      this.filteredModeList = [...this.modeList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredModeList = this.modeList.filter(mode =>
      mode.modeofoperation?.toLowerCase().includes(searchTerm)  // Changed from modename
    );
}

  openDialog(): void {
    this.modalTitle = 'Add New Mode of Operation';
    this.isEditMode = false;
    this.editingMode = null;
    this.modeForm.reset();
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editMode(mode: any): void {
    this.modeForm.patchValue({
      modeofoperation: mode.modeofoperation
    });
    
    this.modalTitle = 'Edit Mode of Operation';
    this.isEditMode = true;
    this.editingMode = mode;
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}
