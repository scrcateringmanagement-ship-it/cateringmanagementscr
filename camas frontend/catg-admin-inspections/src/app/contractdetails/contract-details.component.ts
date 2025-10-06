import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { intervalToDuration } from 'date-fns';

@Component({
  selector: 'app-contract-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  contractorForm: FormGroup;
  modalTitle: string = 'Add New Contractor';
  isEditMode: boolean = false;
  editingContractor: any = null;
  selectedCategoryId: any;
  isTerminating: boolean = false;
  isReassigning: boolean = false;

  statusOptions = [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
  ];
  category: any;
  modeOfOperations: any[] = [];
  modeOfPayments: any[] = [];
  railwayInfos: any[] = [];
  statuses: any[] = [];
  searchText: string = '';
  contractorList: any[] = [];
  filteredContractorList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService,
  ) {
    this.contractorForm = this.fb.group({
      contract_id: [''],
      licensee_id: [''],
      contract_code: ['', Validators.required],
      Licensee_firm_name: ['', Validators.required],
      Licensee_name: ['', Validators.required],
      Licensee_mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Lincensee_pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      Lincensee_type: ['', Validators.required],
      Lincensee_status: ['active', Validators.required],
      Lincensee_zone: [localStorage.getItem('zone') || 'SCR', Validators.required],
      Lincensee_division: [localStorage.getItem('division') || 'BZA', Validators.required],
      contract_station_name: ['', Validators.required],
      contract_stall: ['', Validators.required],
      contract_type: ['', Validators.required],
      contract_status: ['active', Validators.required],
      contract_zone: [localStorage.getItem('zone') || 'SCR', Validators.required],
      contract_division: [localStorage.getItem('division') || 'BZA', Validators.required],
      contract_location: ['', Validators.required],
      contract_details_start_date: [null],
      contract_details_end_date: [null],
      contract_details_activity: [null],
      contract_details_remarks: [''],
      contract_details_pay_mode: [null],
      contract_details_mode_of_operation: [null],
      contract_details_no_of_employees: [null, Validators.min(0)],
      contract_details_duration: [null],
      managermobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      contract_details_award_status: ['no'],
      termination_date: [''],
      remarks: ['']
    });

    this.contractorForm.get('contract_details_start_date')?.valueChanges.subscribe(() => this.calculateDuration());
    this.contractorForm.get('contract_details_end_date')?.valueChanges.subscribe(() => this.calculateDuration());
  }

  ngOnInit() {
    this.contractorList = [];
    this.filteredContractorList = [];
    this.getCategory();
    this.getContractorDetails();
    this.loadDropdownData();
    this.loadStatusOptions();
  }

  loadStatusOptions() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });

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
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });

    this.apicall.getModeOfOperation(data).subscribe({
      next: (resmop: any) => {
        this.modeOfOperations = resmop[0];
      }
    });

    this.apicall.getModeOfPayment(data).subscribe({
      next: (resmpy: any) => {
        this.modeOfPayments = resmpy;
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

  getCategory() {
    this.apicall.getcatergory().subscribe({
      next: (res: any) => {
        this.category = res;
      }
    });
  }

  getContractorDetails() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });

    this.apicall.getContractorDetails(data).subscribe({
      next: (res: any) => {
       // console.log(res);
        this.contractorList = res.contract_details;
        this.filteredContractorList = [...this.contractorList];
      }
    });
  }

  openDialog(): void {
    this.modalTitle = 'Add New Contractor';
    this.isEditMode = false;
    this.editingContractor = null;
    this.isTerminating = false;
    this.isReassigning = false;
    this.contractorForm.reset();
    this.contractorForm.patchValue({
      Lincensee_status: 'active',
      contract_status: 'active',
      Lincensee_zone: localStorage.getItem('zone') || 'SCR',
      Lincensee_division: localStorage.getItem('division') || 'BZA',
      contract_zone: localStorage.getItem('zone') || 'SCR',
      contract_division: localStorage.getItem('division') || 'BZA',
      contract_details_award_status: 'no'
    });

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCategoryChange(event: any): void {
    this.selectedCategoryId = event.target.value;
    this.contractorForm.patchValue({ Lincensee_type: this.selectedCategoryId });
  }

  onSubmit(): void {
    
    if (this.isTerminating) {
      if (!this.contractorForm.get('termination_date')?.value || !this.contractorForm.get('remarks')?.value) {
        alert('Please fill in both termination date and remarks');
        return;
      }

      const terminationData = {
        id: this.editingContractor.id || this.contractorForm.get('contract_id')?.value,
        contract_id: this.contractorForm.get('contract_id')?.value,
        licensee_id: this.contractorForm.get('licensee_id')?.value,
        termination_date: this.contractorForm.get('termination_date')?.value,
        remarks: this.contractorForm.get('remarks')?.value,
        zone: localStorage.getItem('zone'),
        division: localStorage.getItem('division'),
        managermobile: this.contractorForm.get('managermobile')?.value,
        contract_status: 'terminated'
      };

      this.apicall.terminateContractDetails(JSON.stringify(terminationData)).subscribe({
        next: (res: any) => {
          this.getContractorDetails();
          this.closeModal();
          alert('Contract terminated successfully!');
        },
        error: (err) => {
          console.error('Error terminating contract:', err);
          alert('Failed to terminate contract. Please try again.');
        }
      });
    } else if (this.isReassigning) {
      if (!this.contractorForm.valid) {
        alert('Please fill all required fields correctly.');
        return;
      }

      const reassignData = {
        contractawdid: this.editingContractor.id || this.contractorForm.get('contract_id')?.value,
      };
      //console.log(reassignData);

      this.apicall.reAssignContracts(JSON.stringify(reassignData)).subscribe({
        next: (res: any) => {
         // console.log(res);
          this.getContractorDetails();
          this.closeModal();
          alert('Contract reassigned successfully!');
        },
        error: (err) => {
          console.error('Error reassigning contract:', err);
          alert('Failed to reassign contract. Please try again.');
        }
      });
    } else {
      if (!this.contractorForm.valid) {
        console.error('Contractor Form is invalid:', this.contractorForm.errors);
        alert('Please fill all required fields correctly.');
        return;
      }

      const formData = JSON.stringify({
        ...this.contractorForm.value,
        id: this.isEditMode ? this.editingContractor.id : null,
        contract_id: this.contractorForm.get('contract_id')?.value,
        licensee_id: this.contractorForm.get('licensee_id')?.value
      });

      if (this.isEditMode) {
        this.apicall.updateContractorDetails(formData).subscribe({
          next: (res: any) => {
            this.getContractorDetails();
            this.modalService.dismissAll();
            alert('Contract updated successfully!');
          },
          error: (err) => {
            console.error('Error updating contract:', err);
            alert('Failed to update contract. Please try again.');
          }
        });
      } else {
        this.apicall.insertContractorDetails(formData).subscribe({
          next: (res: any) => {
            this.getContractorDetails();
            this.modalService.dismissAll();
            alert('Contract created successfully!');
          },
          error: (err) => {
            console.error('Error creating contract:', err);
            alert('Failed to create contract. Please try again.');
          }
        });
      }
    }
  }

  closeModal(): void {
    this.isTerminating = false;
    this.isReassigning = false;
    this.modalService.dismissAll();
    this.contractorForm.reset();
    Object.keys(this.contractorForm.controls).forEach(key => {
      this.contractorForm.get(key)?.enable();
    });
  }

  editContractor(contractor: any): void {
    this.contractorForm.patchValue({
      contract_id: contractor.contract_id,
      licensee_id: contractor.licensee_id,
      contract_code: contractor.contract_code,
      Licensee_firm_name: contractor.Licensee_firm_name,
      Licensee_name: contractor.Licensee_name,
      Licensee_mobile: contractor.Licensee_mobile,
      Lincensee_pan: contractor.Lincensee_pan,
      Lincensee_type: contractor.Lincensee_type,
      Lincensee_status: contractor.Lincensee_status,
      Lincensee_zone: contractor.Lincensee_zone,
      Lincensee_division: contractor.Lincensee_division,
      contract_station_name: contractor.contract_station_name,
      contract_stall: contractor.contract_stall,
      contract_type: contractor.contract_type,
      contract_status: contractor.contract_status,
      contract_zone: contractor.contract_zone,
      contract_division: contractor.contract_division,
      contract_location: contractor.contract_location,
      contract_details_start_date: contractor.contract_details_start_date,
      contract_details_end_date: contractor.contract_details_end_date,
      contract_details_activity: contractor.contract_details_activity,
      contract_details_remarks: contractor.contract_details_remarks,
      contract_details_pay_mode: contractor.contract_details_pay_mode,
      contract_details_mode_of_operation: contractor.contract_details_mode_of_operation,
      contract_details_no_of_employees: contractor.contract_details_no_of_employees,
      contract_details_duration: contractor.contract_details_duration,
      managermobile: contractor.managermobile,
      contract_details_award_status: contractor.contract_details_award_status
    });

    this.modalTitle = 'Edit Contractor';
    this.isEditMode = true;
    this.isTerminating = false;
    this.isReassigning = false;
    this.editingContractor = contractor;

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static'
    });
  }

  reAssignContracts(contractor: any): void {
    const reassignData = {
      contractawdid: contractor.id,
    };
    // console.log(contractor);

    this.apicall.reAssignContracts(JSON.stringify(reassignData)).subscribe({
      next: (res: any) => {
        this.getContractorDetails();
        alert('Contract reassigned successfully!');
      },
      error: (err) => {
        console.error('Error reassigning contract:', err);
        alert('Failed to reassign contract. Please try again.');
      }
    });
  }

  terminateContract(contractor: any): void {
    this.isTerminating = true;
    this.modalTitle = 'Terminate Contract';

    this.contractorForm.patchValue({
      contract_id: contractor.id || contractor.contract_id,
      licensee_id: contractor.licensee_id,
      Licensee_firm_name: contractor.Licensee_firm_name,
      Licensee_name: contractor.Licensee_name,
      Licensee_mobile: contractor.Licensee_mobile,
      Lincensee_pan: contractor.Lincensee_pan,
      Lincensee_type: contractor.Lincensee_type,
      Lincensee_status: contractor.Lincensee_status,
      Lincensee_zone: contractor.Lincensee_zone,
      Lincensee_division: contractor.Lincensee_division,
      contract_station_name: contractor.contract_station_name,
      contract_code: contractor.contract_code,
      contract_location: contractor.contract_location,
      contract_stall: contractor.contract_stall,
      contract_type: contractor.contract_type,
      contract_status: contractor.contract_status,
      contract_zone: contractor.contract_zone,
      contract_division: contractor.contract_division,
      contract_details_start_date: contractor.contract_details_start_date,
      contract_details_end_date: contractor.contract_details_end_date,
      contract_details_activity: contractor.contract_details_activity,
      contract_details_remarks: contractor.contract_details_remarks,
      contract_details_pay_mode: contractor.contract_details_pay_mode,
      contract_details_mode_of_operation: contractor.contract_details_mode_of_operation,
      contract_details_no_of_employees: contractor.contract_details_no_of_employees,
      contract_details_duration: contractor.contract_details_duration,
      managermobile: contractor.managermobile,
      contract_details_award_status: contractor.contract_details_award_status,
      termination_date: '',
      remarks: ''
    });
    //console.log(this.contractorForm.patchValue);

    Object.keys(this.contractorForm.controls).forEach(key => {
      if (key !== 'termination_date' && key !== 'remarks') {
        this.contractorForm.get(key)?.disable();
      }
    });

    this.editingContractor = contractor;

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static'
    });
  }

  filterContractors(): void {
    if (!this.searchText || this.searchText.trim() === '') {
      this.filteredContractorList = [...this.contractorList];
      return;
    }

    const searchTerm = this.searchText.trim().toLowerCase();
    this.filteredContractorList = this.contractorList.filter(contractor =>
      contractor.Licensee_firm_name?.toLowerCase().includes(searchTerm) ||
      contractor.Licensee_name?.toLowerCase().includes(searchTerm) ||
      contractor.Licensee_mobile?.toString().toLowerCase().includes(searchTerm) ||
      contractor.contract_code?.toString().toLowerCase().includes(searchTerm) ||
      contractor.Lincensee_pan?.toLowerCase().includes(searchTerm) ||
      contractor.contract_station_name?.toLowerCase().includes(searchTerm) ||
      contractor.section_name?.toLowerCase().includes(searchTerm) ||
      contractor.managermobile?.toString().toLowerCase().includes(searchTerm)
    );
  }

  calculateDuration(): void {
    const startDate = this.contractorForm.get('contract_details_start_date')?.value;
    const endDate = this.contractorForm.get('contract_details_end_date')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date format:', { startDate, endDate });
        this.contractorForm.patchValue({ contract_details_duration: '' });
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

      this.contractorForm.patchValue({
        contract_details_duration: `${years} years, ${months} months, ${days} days`,
      });
    } else {
      this.contractorForm.patchValue({ contract_details_duration: '' });
    }
  }
}