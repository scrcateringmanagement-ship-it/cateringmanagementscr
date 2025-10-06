import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-licensee-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './licensee-details.component.html',
  styleUrls: ['./licensee-details.component.css']
})
export class LicenseeDetailsComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  licenseeForm: FormGroup;
  modalTitle: string = 'Add New Licensee';
  isEditMode: boolean = false;
  editingLicensee: any = null;
  selectedCategoryId: any;

  statusOptions = [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
  ];
  category: any;

  // Dropdown properties
  modeOfOperations: any[] = [];
  modeOfPayments: any[] = [];
  railwayInfos: any[] = [];
  statuses: any[] = [];

  searchText: string = '';
  licenseeList: any[] = [];
  filteredLicenseeList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService,
    private encservice:CryptoService

  ) {
    const { zone, division } = this.getZoneAndDivision();

    this.licenseeForm = this.fb.group({
      Licensee_firm_name: ['', Validators.required],
      Licensee_name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      type: ['', Validators.required],
      status: ['active', Validators.required],
      zone: [zone, Validators.required],
      division: [division, Validators.required]
    });
  }

  ngOnInit() {
    // const userData = localStorage.getItem('user');
    // //console.log('User Data:', userData ? JSON.parse(userData) : 'No user data in localStorage');
    this.getcatergory();
    this.getlicenseeDetails();
    this.filteredLicenseeList = [...this.licenseeList];
    this.loadDropdownData();
    this.loadStatusOptions();
  }

  // Helper method to retrieve zone and division from localStorage
  private getZoneAndDivision(): { zone: string; division: string } {
     const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);
    
    let zone = 'SCR'; // Default value
    let division = 'BZA'; // Default value

    if (userData) {
      const user = userData;
      zone = user.zone || 'SCR';
      division = user.division || 'BZA';
    }

    return { zone, division };
  }

  loadStatusOptions() {
    const { zone, division } = this.getZoneAndDivision();
    const data = JSON.stringify({ zone, division });

    this.apicall.getStatus(data).subscribe({
      next: (res: any) => {
        this.statusOptions = res.map((status: any) => ({
          name: status.status,
          value: status.status.toLowerCase()
        }));
      }
    });
  }

  loadDropdownData() {
    const { zone, division } = this.getZoneAndDivision();
    const data = JSON.stringify({ zone, division });

    this.apicall.getModeOfOperation(data).subscribe({
      next: (res: any) => {
        this.modeOfOperations = res;
      }
    });

    this.apicall.getModeOfPayment(data).subscribe({
      next: (res: any) => {
        this.modeOfPayments = res;
      }
    });

    this.apicall.getRailwayInfo(data).subscribe({
      next: (res: any) => {
        this.railwayInfos = res;
      }
    });

    this.apicall.getStatus(data).subscribe({
      next: (res: any) => {
        this.statuses = res;
      }
    });
  }

  getcatergory() {
    this.apicall.getcatergory().subscribe({
      next: (res: any) => {
        this.category = res;
      }
    });
  }

  getlicenseeDetails() {
    const { zone, division } = this.getZoneAndDivision();
    const data = JSON.stringify({ zone, division });

    this.apicall.getLicenseeDetails(data).subscribe({
      next: (res: any) => {
        this.licenseeList = res;
        this.filteredLicenseeList = [...this.licenseeList];
      }
    });
  }

  openDialog(): void {
    this.modalTitle = 'Add New Licensee';
    this.isEditMode = false;
    this.editingLicensee = null;
    this.licenseeForm.reset();
    const { zone, division } = this.getZoneAndDivision();
    this.licenseeForm.patchValue({ status: 'active', zone, division });

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCategoryChange(event: any): void {
    this.selectedCategoryId = event.target.value;
    this.licenseeForm.patchValue({ type: this.selectedCategoryId });
  }

  onSubmit(): void {
    const { zone, division } = this.getZoneAndDivision();
    this.licenseeForm.patchValue({ zone, division });

    const formData = JSON.stringify({
      ...this.licenseeForm.value,
      id: this.isEditMode ? this.editingLicensee.id : null
    });

    if (this.isEditMode) {
      this.apicall.updateLicenseeDetails(formData).subscribe({
        next: (res: any) => {
          //console.log('Updated:', res);
          this.getlicenseeDetails();
          this.modalService.dismissAll();
        }
      });
    } else {
      this.apicall.insertLicenseeDetails(formData).subscribe({
        next: (res: any) => {
          //console.log('Created:', res);
          this.getlicenseeDetails();
          this.modalService.dismissAll();
        }
      });
    }
  }

  editLicensee(licensee: any): void {
    this.licenseeForm.patchValue({
      Licensee_firm_name: licensee.Licensee_firm_name,
      Licensee_name: licensee.Licensee_name,
      mobile: licensee.mobile,
      pan: licensee.pan,
      type: licensee.type,
      status: licensee.status,
      zone: licensee.zone,
      division: licensee.division
    });

    this.modalTitle = 'Edit Licensee';
    this.isEditMode = true;
    this.editingLicensee = licensee;

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static'
    });
  }

  deleteLicensee(licensee: any): void {
    if (confirm(`Are you sure you want to delete licensee "${licensee.Licensee_firm_name}"?`)) {
      const data = JSON.stringify({
        id: licensee.id
      });

      this.apicall.deleteLicenseeDetails(data).subscribe({
        next: (res: any) => {
          //console.log('Deleted:', res);
          this.getlicenseeDetails();
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterLicensees(): void {
    if (!this.searchText) {
      this.filteredLicenseeList = [...this.licenseeList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredLicenseeList = this.licenseeList.filter(licensee =>
      licensee.Licensee_firm_name?.toLowerCase().includes(searchTerm) ||
      licensee.Licensee_name?.toLowerCase().includes(searchTerm) ||
      licensee.mobile?.toString().includes(searchTerm) ||
      licensee.pan?.toLowerCase().includes(searchTerm)
    );
  }
}