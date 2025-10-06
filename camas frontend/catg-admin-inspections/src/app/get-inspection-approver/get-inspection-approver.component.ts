import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-get-inspection-approver',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, PdfViewerModule],
  templateUrl: './get-inspection-approver.component.html',
  styleUrl: './get-inspection-approver.component.css'
})
export class GetInspectionApproverComponent implements OnInit {
  searchText: string = '';
  filteredidcardsList: any[] = [];
  idcardsList: any[] = [];
  selectedIdcard: any = null;
  selectedFormId: string | null = null;
  errorMessage: string | null = null;
  remarks: string = '';
  ccimenuselect: boolean = false;
  successMessage: string | null = null;
  isLoading: boolean = false;
  private modalRef: NgbModalRef | null = null;
  selectedFile: string | null = null;
  selectedFileName: string | null = null;
  imageScale: number = 1;
  inspdata: any[] = [];
  inspforwardingdata: any[] = [];
  inspdatabyid: any = null;
  inspectionForm: FormGroup;
  actionsTaken: any[] = [];
  userDesig: String = '';
  userZone: String = '';
  userDiv: String = '';

  constructor(
    private apicall: ApicallService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private encservice:CryptoService
  ) {
    this.inspectionForm = this.fb.group({
      actionTaken: ['', Validators.required],
      fineImposed: ['', Validators.min(0)],
      actionRemarks: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.ccimenuselect = this.apicall.ccimenuselect;
    this.getForwardInspectionData();
    this.inspectionForm.get('actionTaken')?.valueChanges.subscribe(value => {
      const fineControl = this.inspectionForm.get('fineImposed');
      if (value === 'fined') {
        fineControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        fineControl?.clearValidators();
        fineControl?.setValidators(Validators.min(0));
      }
      this.getActionsTaken();
      fineControl?.updateValueAndValidity();
    });
  }

 getForwardInspectionData() {
  const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

  //console.log('userData: ', userData);
  this.userZone = userData.zone;
  this.userDiv = userData.division;

  const data = JSON.stringify({
    zone: this.userZone,
    division: this.userDiv
  });

  this.apicall.getForwardInspectionData(data).subscribe({
    next: (res: any) => {
      //console.log('Inspection Data:', res);
      if (res && res.inspforwardingdata && Array.isArray(res.inspforwardingdata)) {
        this.inspdata = res.inspforwardingdata; // Assign to inspdata
      } else {
        console.error('Unexpected response format:', res);
        this.inspdata = [];
        this.errorMessage = res.message || 'No inspection data available.';
      }
    },
    error: (err) => {
      console.error('API call failed:', err);
      this.inspdata = [];
      this.errorMessage = err.message || 'Failed to load inspection data.';
    }
  });
}

  getActionsTaken() {
    this.apicall.getActionTaken().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.actionsTaken = res.map((item: any) => ({
            label: item.actiontaken,
            value: item.actiontaken
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching actions taken:', err);
        alert('Failed to fetch actions taken. Please try again.');
      }
    });
  }

  ViewIdcarddetails(content: any, inspection: any) {
    this.selectedFormId = inspection.id;

    const payload = {
      inspectionId: this.selectedFormId
    };

    this.apicall.getCciInspectionDetails(JSON.stringify(payload)).subscribe({
      next: (res: any) => {
        //console.log('Inspection Details:', res);
        if (res && res.inspdatabyid) {
          this.inspdatabyid = res.inspdatabyid;
          this.selectedIdcard = { ...res.inspdatabyid, id: this.selectedFormId };
          this.inspectionForm.reset();
          this.modalRef = this.modalService.open(content, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false
          });
        } else {
          this.errorMessage = 'No inspection details found.';
        }
      },
      error: (err) => {
        console.error('Failed to fetch inspection details:', err);
        this.errorMessage = 'Failed to load inspection details.';
      }
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.selectedIdcard = null;
    this.selectedFormId = null;
    this.selectedFile = null;
    this.selectedFileName = null;
    this.imageScale = 1;
    this.remarks = '';
    this.errorMessage = null;
    this.successMessage = null;
    this.inspectionForm.reset();
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Pending With CCI';
      case 1:
        return 'Pending with Office User';
      case 2:
        return 'Pending with Approver';
      default:
        return 'Unknown Status';
    }
  }

  forward() {
    if (!this.selectedIdcard || !this.selectedFormId || this.isLoading || this.inspectionForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.isLoading = true;
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

    this.userDesig = userData.desig
    const actionTakenValue = this.inspectionForm.get('actionRemarks')?.value;
    const concatenatedActionTaken = actionTakenValue ? `${actionTakenValue} By ${this.userDesig}` : 'Unknown';

    const payload = {
      inspectionId: this.selectedFormId,
      remarks: concatenatedActionTaken,
      actionTaken: this.inspectionForm.get('actionTaken')?.value,
      finedAmount: this.inspectionForm.get('fineImposed')?.value || 0,
    };

    //console.log('Forward Payload:', payload);
    this.apicall.approverUpdateAction(payload).subscribe({
      next: (res: any) => {
        this.idcardsList = [];
        this.filteredidcardsList = [];
        this.successMessage = 'ID Card forwarded successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getForwardInspectionData();
        }, 2000);
      },
      error: (err) => {
        console.error('Forwarding failed:', err);
        this.errorMessage = 'Failed to forward ID Card.';
        this.isLoading = false;
      }
    });
  }

  return() {
    if (!this.selectedIdcard || !this.selectedFormId || this.isLoading) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.isLoading = true;
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

    this.userDesig = userData.desig
    const actionTakenValue = this.inspectionForm.get('actionRemarks')?.value;
    const concatenatedActionTaken = actionTakenValue ? `${actionTakenValue} By ${this.userDesig}` : 'Unknown';

    const payload = {
      inspectionId: this.selectedFormId,
      returnRemarks: concatenatedActionTaken,
    };

    //console.log('Forward Payload:', payload);
    this.apicall.returnInspection(payload).subscribe({
      next: (res: any) => {
        this.idcardsList = [];
        this.filteredidcardsList = [];
        this.successMessage = 'ID Card forwarded successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getForwardInspectionData();
        }, 2000);
      },
      error: (err) => {
        console.error('Forwarding failed:', err);
        this.errorMessage = 'Failed to forward ID Card.';
        this.isLoading = false;
      }
    });
  }
}