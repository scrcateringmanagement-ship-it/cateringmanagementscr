import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { intervalToDuration } from 'date-fns';
import { NgSelectModule } from '@ng-select/ng-select';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-contract-asset-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './contract-asset-details.component.html',
  styleUrls: ['./contract-asset-details.component.css']
})
export class ContractAssetDetailsComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('awardDialog') awardDialog!: TemplateRef<any>;
  contractAssetForm: FormGroup;
  awardForm: FormGroup;
  modalTitle: string = 'Add New Contract Asset';
  isEditMode: boolean = false;
  editingContractAsset: any = null;
  selectedCategoryId: any;
  selectedLicensee: any = null;
  selectedAsset: any = null;

  statusOptions = [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
  ];
  category: any;
  licenseeList: any[] = [];
  paymentMode: any[] = [];
  operationModes: any[] = [];
  locationType: any[] = [];

  searchText: string = '';
  contractAssetsList: any[] = [];
  filteredContractAssetsList: any[] = [];
  railwayList: any[] = [];
  filteredRailwayList: any[] = [];
  user: any = {};

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService,
    private encservice: CryptoService
  ) {
    const { zone, division } = this.getZoneAndDivision();

    this.contractAssetForm = this.fb.group({
      contract_code: ['', Validators.required],
      station_name: ['', Validators.required],
      contract_location: ['', Validators.required],
      stall: ['', Validators.required],
      type: ['', Validators.required],
      status: ['active', Validators.required],
      zone: [zone, Validators.required],
      division: [division, Validators.required]
    });

    this.awardForm = this.fb.group({
      licensee_id: ['', Validators.required],
      contract_asset_id: ['', Validators.required],
      zone: [zone, Validators.required],
      division: [division, Validators.required],
      activity: ['', Validators.required],
      mode_of_operation: ['', Validators.required],
      no_of_employees: [0, [Validators.required, Validators.min(0)]],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      duration: [''],
      remarks: [''],
      status: ['active', Validators.required],
      managermobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });

    this.awardForm.get('from_date')?.valueChanges.subscribe(() => this.calculateDuration());
    this.awardForm.get('to_date')?.valueChanges.subscribe(() => this.calculateDuration());
  }

  ngOnInit() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}');
    const userData = JSON.parse(userstoragedecryptData);

    this.getcatergory();
    this.getContractAssetDetails();
    this.filteredContractAssetsList = [...this.contractAssetsList];
    this.getLicenseeList();
    this.loadStatusOptions();
    this.loadDropdownData();
    this.getRailwayInfo();
  }

  getRailwayInfo() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}');
    const userData = JSON.parse(userstoragedecryptData);

    const localuser = userData;
    const data = {
      "zone": localuser.zone,
      "division": localuser.division,
    };

    this.apicall.getRailwayInfo(data).subscribe({
      next: (res: any) => {
        this.railwayList = res;
        const seenSections = new Set();
        this.filteredRailwayList = this.railwayList.filter(item => {
          if (!seenSections.has(item.section)) {
            seenSections.add(item.section);
            return true;
          }
          return false;
        });
      },
      error: (err) => {
        console.error('Error fetching railway info:', err);
        alert('Failed to fetch railway info. Please try again.');
      }
    });
  }

  private getZoneAndDivision(): { zone: string; division: string } {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}');
    const userData = JSON.parse(userstoragedecryptData);

    let zone = 'SCR';
    let division = 'BZA';

    if (userData) {
      const user = userData;
      zone = user.zone || 'SCR';
      division = user.division || 'BZA';
    }

    return { zone, division };
  }

  loadDropdownData() {
    const { zone, division } = this.getZoneAndDivision();
    const data = JSON.stringify({ zone, division });

    this.apicall.getModeOfOperation(data).subscribe({
      next: (resmop: any) => {
        this.operationModes = resmop[0];
      },
      error: (err) => console.error('Error fetching mode of operation:', err)
    });

    this.apicall.getModeOfPayment(data).subscribe({
      next: (resmpy: any) => {
        this.paymentMode = resmpy;
      },
      error: (err) => console.error('Error fetching mode of payment:', err)
    });

    this.apicall.getLocationType(data).subscribe({
      next: (res: any) => {
        this.locationType = res;
      },
      error: (err) => console.error('Error fetching location type:', err)
    });
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
      },
      error: (err) => console.error('Error fetching status options:', err)
    });
  }

  getcatergory() {
    this.apicall.getcatergory().subscribe({
      next: (res: any) => {
        this.category = res;
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  filterStations(event: { term: string }) {
    const searchTerm = event.term.toLowerCase();
    this.filteredRailwayList = this.railwayList.filter(station =>
      station.station.toLowerCase().includes(searchTerm)
    );
  }

  getContractAssetDetails() {
    const { zone, division } = this.getZoneAndDivision();
    const data = JSON.stringify({ zone, division });

    this.apicall.getContractAssetDetails(data).subscribe({
      next: (res: any) => {
        this.contractAssetsList = res;
        this.filteredContractAssetsList = [...this.contractAssetsList];
      },
      error: (err) => console.error('Error fetching contract assets:', err)
    });
  }

  getLicenseeList() {
    const { zone, division } = this.getZoneAndDivision();
    const data = JSON.stringify({ zone, division });

    this.apicall.getLicenseeDetails(data).subscribe({
      next: (res: any) => {
        this.licenseeList = res;
      },
      error: (err) => console.error('Error fetching licensees:', err)
    });
  }

  openDialog(): void {
    this.modalTitle = 'Add New Contract Asset';
    this.isEditMode = false;
    this.editingContractAsset = null;
    this.contractAssetForm.reset();
    const { zone, division } = this.getZoneAndDivision();
    this.contractAssetForm.patchValue({
      status: 'active',
      zone,
      division
    });

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }

  onCategoryChange(event: any): void {
    this.selectedCategoryId = event.target.value;
    this.contractAssetForm.patchValue({ type: this.selectedCategoryId });
  }

  onLicenseeChange(selected: any): void {
    this.selectedLicensee = selected;
    this.awardForm.patchValue({ licensee_id: selected?.id });
  }

  onSubmit(): void {
    if (!this.contractAssetForm.valid) {
      console.error('Contract Asset Form is invalid:', this.contractAssetForm.errors);
      alert('Please fill all required fields correctly.');
      return;
    }

    if (this.isEditMode && (!this.editingContractAsset || !this.editingContractAsset.id)) {
      console.error('Editing contract asset is missing or has no ID');
      alert('Error: Cannot update contract asset. Missing ID.');
      return;
    }

    const { zone, division } = this.getZoneAndDivision();
    this.contractAssetForm.patchValue({ zone, division });

    const formData = JSON.stringify({
      id: this.isEditMode ? this.editingContractAsset.id : null,
      contract_code: this.contractAssetForm.get('contract_code')?.value,
      station_name: this.contractAssetForm.get('station_name')?.value,
      contract_location: this.contractAssetForm.get('contract_location')?.value,
      stall: this.contractAssetForm.get('stall')?.value,
      type: this.contractAssetForm.get('type')?.value,
      status: this.contractAssetForm.get('status')?.value,
      zone: this.contractAssetForm.get('zone')?.value,
      division: this.contractAssetForm.get('division')?.value
    });

    if (this.isEditMode) {
      this.apicall.updateContractAssetDetails(formData).subscribe({
        next: (res: any) => {
          this.getContractAssetDetails();
          this.modalService.dismissAll();
          alert('Contract asset updated successfully!');
        },
        error: (err: any) => {
          console.error('Error updating contract asset:', err);
          alert('Failed to update contract asset. Please try again.');
        }
      });
    } else {
      this.apicall.insertContractAssetDetails(formData).subscribe({
        next: (res: any) => {
          this.getContractAssetDetails();
          this.modalService.dismissAll();
          alert('Contract asset created successfully!');
        },
        error: (err: any) => {
          console.error('Error creating contract asset:', err);
          alert('Failed to create contract asset. Please try again.');
        }
      });
    }
  }

  editContractAsset(asset: any): void {
    this.contractAssetForm.patchValue({
      contract_code: asset.contract_code,
      station_name: asset.station_name,
      contract_location: asset.contract_location,
      stall: asset.stall,
      type: asset.type,
      status: asset.status,
      zone: asset.zone,
      division: asset.division
    });

    this.modalTitle = 'Edit Contract Asset';
    this.isEditMode = true;
    this.editingContractAsset = asset;

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }

  deleteContractAsset(asset: any): void {
    if (confirm(`Are you sure you want to delete contract asset "${asset.contract_code}"?`)) {
      const data = JSON.stringify({ id: asset.id });

      this.apicall.deleteContractAssetDetails(data).subscribe({
        next: (res: any) => {
          this.getContractAssetDetails();
        },
        error: (err) => console.error('Error deleting contract asset:', err)
      });
    }
  }

  filterContractAssets(): void {
    if (!this.searchText) {
      this.filteredContractAssetsList = [...this.contractAssetsList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredContractAssetsList = this.contractAssetsList.filter(asset =>
      asset.contract_code?.toLowerCase().includes(searchTerm) ||
      asset.station_name?.toLowerCase().includes(searchTerm) ||
      asset.contract_location?.toLowerCase().includes(searchTerm) ||
      asset.stall?.toLowerCase().includes(searchTerm) ||
      asset.type?.toLowerCase().includes(searchTerm)
    );
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.awardForm.reset();
    this.selectedLicensee = null;
    this.selectedAsset = null;
  }

  openAwardDialog(asset: any): void {
    this.selectedAsset = asset;
    const { zone, division } = this.getZoneAndDivision();
    this.awardForm.reset();
    this.awardForm.patchValue({
      contract_asset_id: asset.id,
      zone,
      division,
      status: 'active'
    });

    this.modalService.open(this.awardDialog, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }

  awardContract(): void {
    if (!this.awardForm.valid) {
      console.error('Award Form is invalid:', this.awardForm.errors);
      Object.keys(this.awardForm.controls).forEach(key => {
        const control = this.awardForm.get(key);
        if (control?.invalid) {
          console.error(`Field ${key} is invalid:`, control.errors);
        }
      });
      alert('Please fill all required fields correctly.');
      return;
    }

    if (!this.selectedLicensee) {
      console.error('No licensee selected');
      alert('Please select a licensee.');
      return;
    }

    if (!this.selectedAsset) {
      console.error('No asset selected');
      alert('No contract asset selected.');
      return;
    }

    const { zone, division } = this.getZoneAndDivision();
    this.awardForm.patchValue({ zone, division });

    const contractData = {
      contract_id: this.selectedAsset.id,
      licensee_id: this.selectedLicensee.id,
      Licensee_firm_name: this.selectedLicensee.Licensee_firm_name,
      Licensee_name: this.selectedLicensee.Licensee_name,
      Licensee_mobile: this.selectedLicensee.mobile,
      Lincensee_pan: this.selectedLicensee.pan,
      Lincensee_type: this.selectedLicensee.type,
      Lincensee_status: this.selectedLicensee.status,
      Lincensee_zone: this.selectedLicensee.zone,
      Lincensee_division: this.selectedLicensee.division,
      contract_station_name: this.selectedAsset.station_name,
      contract_code: this.selectedAsset.contract_code,
      contract_location: this.selectedAsset.contract_location,
      contract_stall: this.selectedAsset.stall,
      contract_type: this.selectedAsset.type,
      contract_status: this.selectedAsset.status,
      contract_zone: this.selectedAsset.zone,
      contract_division: this.selectedAsset.division,
      contract_details_start_date: this.awardForm.get('from_date')?.value,
      contract_details_end_date: this.awardForm.get('to_date')?.value,
      contract_details_activity: this.awardForm.get('activity')?.value,
      contract_details_remarks: this.awardForm.get('remarks')?.value || '',
      contract_details_mode_of_operation: this.awardForm.get('mode_of_operation')?.value,
      contract_details_no_of_employees: this.awardForm.get('no_of_employees')?.value || 0,
      contract_details_duration: this.awardForm.get('duration')?.value,
      managermobile: this.awardForm.get('managermobile')?.value,
      contract_details_award_status: 'yes'
    };

    const formData = JSON.stringify(contractData);

    this.apicall.insertContractDetails(formData).subscribe({
      next: (res: any) => {
        this.getContractAssetDetails();
        this.modalService.dismissAll();
        alert('Contract awarded successfully!');
      },
      error: (err) => {
        console.error('Error awarding contract:', err);
        alert('Failed to award contract. Please try again.');
      }
    });
  }

  calculateDuration(): void {
    const fromDate = this.awardForm.get('from_date')?.value;
    const toDate = this.awardForm.get('to_date')?.value;

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date format:', { fromDate, toDate });
        this.awardForm.patchValue({ duration: '' });
        return;
      }

      let duration = intervalToDuration({ start, end });
      const isAlmostFullYears = (duration.months ?? 0) === 11 && (duration.days ?? 0) >= 27;

      if (isAlmostFullYears) {
        duration.years = (duration.years ?? 0) + 1;
        duration.months = 0;
        duration.days = 0;
      }

      const years = duration.years ?? 0;
      const months = duration.months ?? 0;
      const days = duration.days ?? 0;

      this.awardForm.patchValue({
        duration: ` ${years} years, ${months} months, ${days} days`
      });
    } else {
      this.awardForm.patchValue({ duration: '' });
    }
  }
}