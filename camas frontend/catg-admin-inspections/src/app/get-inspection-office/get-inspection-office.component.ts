import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';


@Component({
  selector: 'app-get-inspection-office',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PdfViewerModule],
  templateUrl: './get-inspection-office.component.html',
  styleUrl: './get-inspection-office.component.css'
})
export class GetInspectionOfficeComponent {
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
  inspdatabyid: any = null; 

  constructor(private apicall: ApicallService, private modalService: NgbModal,private encservice:CryptoService) {}

  ngOnInit() {
    this.ccimenuselect = this.apicall.ccimenuselect;
    this.getInspectionDetailsOfficeUser();
  }

  getInspectionDetailsOfficeUser() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

    const data = JSON.stringify({
      officialId: userData?.id,
    });

    const apiCall = this.apicall.getInspectionDetailsOfficeUser(data);

    apiCall.subscribe({
      next: (res: any) => {
        //console.log('Inspection Data:', res.inspdata.status_update);
        if (res && res.inspdata && Array.isArray(res.inspdata)) {
          this.inspdata = res.inspdata;
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

  ViewIdcarddetails(content: any, inspection: any) {
    this.selectedFormId = inspection.id;

    const payload = {
      inspectionId: this.selectedFormId
    };

    this.apicall.getCciInspectionDetails(JSON.stringify(payload)).subscribe({
      next: (res: any) => {
        //console.log('res',res);
        if (res) {
          this.inspdatabyid = res.inspdatabyid; // Store the response in inspdatabyid
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
    if (!this.selectedIdcard || !this.selectedFormId || this.isLoading) return;

    this.isLoading = true;
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

    const currentDateTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const signature = `Forwarded by ${userData?.name || 'Unknown'}, ${userData?.desig || 'Unknown'} on ${currentDateTime}`;

    const payload = {
      id_form_application: this.selectedFormId,
      sender: 'cci',
      transcation: 'a',
      remarks: this.remarks,
      signature: signature
    };
    //console.log('Forward Payload:', payload);
    this.apicall.cciIdCardApprove(payload).subscribe({
      next: (res: any) => {
        this.idcardsList = [];
        this.filteredidcardsList = [];
        this.successMessage = 'ID Card forwarded successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getInspectionDetailsOfficeUser();
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