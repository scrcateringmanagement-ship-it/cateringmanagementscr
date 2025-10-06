
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-forwarding-inspections',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PdfViewerModule],
  templateUrl: './forwarding-inspections.component.html',
  styleUrls: ['./forwarding-inspections.component.css']
})
export class ForwardingInspectionsComponent {
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
  appdata: any[] = [];
  inspdata: any[] = [];
  inspdatabyid: any = null;
  selectedApproverId: string | null = null;

  constructor(private apicall: ApicallService, private modalService: NgbModal,private encservice:CryptoService) { }

  ngOnInit() {
    this.ccimenuselect = this.apicall.ccimenuselect;
    this.getApproverUsersList();
    this.getForwardingInspectionDetails();
  }

  getApproverUsersList() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);

    //const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const data = JSON.stringify({
      zone: userData?.zone,
      division: userData?.division,
    });

    const apiCall = this.apicall.getApproverUsersList(data);
    apiCall.subscribe({
      next: (res: any) => {
        //console.log('Approver Data:', res);
        if (res && res.appdata && Array.isArray(res.appdata)) {
          this.appdata = res.appdata;
        } else {
          console.error('Unexpected response format:', res);
          this.appdata = [];
          this.errorMessage = res.message === 'No inspections found' ? 'No Data found' : (res.message || 'No inspection data available.');
        }
      },
      error: (err) => {
        console.error('API call failed:', err);
        this.inspdata = [];
        this.errorMessage = err.message === 'No inspections found' ? 'No Data found' : (err.message || 'Failed to load inspection data.');
      }
    });
  }

  getForwardingInspectionDetails() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

    const data = JSON.stringify({
      zone: userData?.zone,
      division: userData?.division,
    });

    const apiCall = this.apicall.getForwardingInspectionDetails(data);
    apiCall.subscribe({
      next: (res: any) => {
        //console.log('Inspection Data:', res);
        if (res && res.inspforwardingdata && Array.isArray(res.inspforwardingdata)) {
          this.inspdata = res.inspforwardingdata;
        } else {
          console.error('Unexpected response format:', res);
          this.inspdata = [];
          this.errorMessage = res.message === 'No inspections found' ? 'No Data found' : (res.message || 'No inspection data available.');
        }
      },
      error: (err) => {
        console.error('API call failed:', err);
        this.inspdata = [];
        this.errorMessage = err.message === 'No inspections found' ? 'No Data found' : (err.message || 'Failed to load inspection data.');
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
        //console.log('res', res);
        if (res) {
          this.inspdatabyid = res.inspdatabyid;
          this.selectedIdcard = { ...res, id: this.selectedFormId };
          this.modalRef = this.modalService.open(content, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false
          });
        }
      },
      error: (err) => {
        console.error('Failed to fetch inspection details:', err);
        this.errorMessage = err.message === 'No inspections found' ? 'No Data found' : (err.message || 'Failed to load inspection details.');
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
    this.selectedApproverId = null;
    this.errorMessage = null;
    this.successMessage = null;
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
    if (!this.selectedIdcard || !this.selectedFormId || !this.selectedApproverId || this.isLoading) return;

    this.isLoading = true;
    const payload = {
      inspection_id: this.selectedFormId,
      forwarded_to: this.selectedApproverId,
      forwarded_remarks: this.remarks,
    };
    //console.log('Forward Payload:', payload);
    this.apicall.updateForwardingInspection(payload).subscribe({
      next: (res: any) => {
        this.idcardsList = [];
        this.filteredidcardsList = [];
        this.successMessage = 'Forwarded successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getForwardingInspectionDetails();
        }, 2000);
      },
      error: (err) => {
        console.error('Forwarding failed:', err);
        this.errorMessage = err.message === 'No inspections found' ? 'No Data found' : (err.message || 'Failed to forward.');
        this.isLoading = false;
      }
    });
  }
}
