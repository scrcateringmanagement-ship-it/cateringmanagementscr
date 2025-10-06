import { Component } from '@angular/core';
import { ApicallService } from '../apicall.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-offficeuserrolegetidcards',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PdfViewerModule,MatDatepickerModule,
    MatInputModule,MatNativeDateModule],
  templateUrl: './offficeuserrolegetidcards.component.html',
  styleUrls: ['./offficeuserrolegetidcards.component.css']
})
export class OffficeuserrolegetidcardsComponent   {
  searchText: string = '';
  filteredidcardsList: any[] = [];
  idcardsList: any[] = [];
  selectedIdcard: any = null;
  errorMessage: string | null = null;
  remarks: string = '';
  validityDate: string | null = null;
  officemenuselect: boolean = false;
  previewImageUrl: string = '';
  previewTitle: string = '';
  fileUrl: string = '';
  showPdf: boolean = false;
  showImage: boolean = false;
  successMessage: string | null = null;
  isLoading: boolean = false;
  private modalRef: NgbModalRef | null = null;
  selectedFile: string | null = null; // Track the selected file URL
  selectedFileName: string | null = null; // Track the selected file name

  constructor(private apicall: ApicallService, private modalService: NgbModal, private encservice: CryptoService) { }



  ngOnInit() {
    this.officemenuselect = this.apicall.officemenuselect;
    this.getCciIdcardData();
  }

   onDateSelected(date: any) {
    this.validityDate = date;
    console.log('Selected date:', this.validityDate);
  }
  
  getCciIdcardData() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);


    const data = JSON.stringify({
      zone: userData?.zone,
      division: userData?.division,
    });

    //console.log('send Data:', data);

    const apiCall = this.officemenuselect
      ? this.apicall.getofficroleData(data)
      : this.apicall.getofficerolesenddata(data);

    apiCall.subscribe({
      next: (res: any) => {
        //console.log('Idcard Data:', res);

        if (Array.isArray(res.data)) {
          this.idcardsList = res.data;
          this.filteredidcardsList = [...this.idcardsList];
        } else {
          console.error('Unexpected response format: not an array', res);
          this.idcardsList = [];
          this.filteredidcardsList = [];
        }
      },
      error: (err) => {
        console.error('API call failed:', err);
        this.errorMessage = 'Failed to load ID card data.';
      }
    });
  }

  filteridcards() {
    if (!this.searchText) {
      this.filteredidcardsList = [...this.idcardsList];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredidcardsList = this.idcardsList.filter(item =>
        item.contract_code?.toLowerCase().includes(searchLower) ||
        item.first_name?.toLowerCase().includes(searchLower) ||
        item.designation?.toLowerCase().includes(searchLower) ||
        item.type_of_card?.toLowerCase().includes(searchLower)
      );
    }
  }

  ViewIdcarddetails(content: any, idcard: any) {
    this.selectedIdcard = idcard;
    //console.log('Selected ID card details:', this.selectedIdcard);
    const payload = {
      form_id: this.selectedIdcard.id
    };
  // console.log('Payload for verified data:', payload);

    this.apicall.getVerifiedData(JSON.stringify(payload)).subscribe({
      next: (res: any) => {
        //console.log('Verified Data:', res);
        if (res) {
          this.selectedIdcard = res;
         // console.log('Selected ID card details:', this.selectedIdcard);
          this.modalRef = this.modalService.open(content, { size: 'lg' });
        } else {
          console.warn('No verified data returned:', res);
          this.errorMessage = 'No verified data available.';
        }
      },
      error: (err) => {
        console.error('Failed to fetch verified data:', err);
        this.errorMessage = 'Failed to load verified data.';
      }
    });
  }


  forwardIdCard() {
    if (!this.selectedIdcard || this.isLoading) return;
    this.isLoading = true;
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
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
      id_form_application: this.selectedIdcard.form_id,
      sender: 'office_user',
      transcation: "a",
      remarks: this.remarks,
      validity_date: this.validityDate,
      signature: signature
    };
  //  console.log('Forwarding payload:', payload);

    this.apicall.officeIdCardApprove(payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'ID Card forwarded successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getCciIdcardData();
        }, 2000);
      },
      error: (err) => {
        console.error('Forwarding failed:', err);
        this.errorMessage = 'Failed to forward ID Card.';
        this.isLoading = false;
      }
    });
  }

  rejectIdCard() {
    if (!this.selectedIdcard) return;

    this.isLoading = true;
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
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
    const signature = `Rejected by ${userData?.name || 'Unknown'}, ${userData?.desig || 'Unknown'} on ${currentDateTime}`;

    // Concatenate previous cci_reject_remarks with new remarks
    const previousRemarks = this.selectedIdcard.officer_reject_remarks || '';
    const combinedRemarks = previousRemarks ? `${previousRemarks}\n\n${this.remarks}` : this.remarks;


    const payload = {
      id_form_application: this.selectedIdcard.form_id,
      sender: 'office_user',
      transcation: "r",
      remarks: combinedRemarks,
      signature: signature
    };

    this.apicall.officeIdCardReject(payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'ID Card rejected successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getCciIdcardData();
        }, 2000);
      },
      error: (err) => {
        console.error('Rejection failed:', err);
        this.errorMessage = 'Failed to reject ID Card.';
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.selectedIdcard = null;
    this.remarks = '';
    this.validityDate = null;
    this.successMessage = null;
    this.errorMessage = null;
    this.isLoading = false;
  }

  openFile(url: string) {
    const ext = url.split('.').pop()?.toLowerCase();
    this.fileUrl = url;
    const features = 'width=1000,height=800,top=100,left=100,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes';
    window.open(url, '_blank', features);
  }
  selectFile(url: string, fileName: string) {
    if (!url) {
      this.errorMessage = `${fileName} is not available.`;
      this.selectedFile = null;
      this.selectedFileName = null;
      return;
    }
    this.selectedFile = url;
    this.selectedFileName = fileName;
    this.errorMessage = null;
  }

  isImage(url: string): boolean {
    if (!url) return false;
    const ext = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '');
  }

  isPdf(url: string): boolean {
    if (!url) return false;
    const ext = url.split('.').pop()?.toLowerCase();
    return ext === 'pdf';
  }

  imageScales: { [key: string]: number } = {};

zoomIn(field: string) {
  this.imageScales[field] = (this.imageScales[field] || 1) + 0.2;
}

zoomOut(field: string) {
  this.imageScales[field] = Math.max((this.imageScales[field] || 1) - 0.2, 0.2);
}

resetZoom(field: string) {
  this.imageScales[field] = 1;
}
}