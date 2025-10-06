import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../apicall.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-approver-getcancelled-idcards',
  standalone: true,
  imports: [CommonModule, FormsModule, PdfViewerModule],
  templateUrl: './approver-getcancelled-idcards.component.html',
  styleUrls: ['./approver-getcancelled-idcards.component.css']
})
export class ApproverGetcancelledIdcardsComponent implements OnInit {
  searchText: string = '';
  filteredidcardsList: any[] = [];
  idcardsList: any[] = [];
  selectedIdcard: any = null;
  errorMessage: string | null = null;
  remarks: string = '';
  approvermenuselect: boolean = false;
  selectedFile: string | null = null;
  selectedFileName: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  private modalRef: NgbModalRef | null = null;
  imageScale: number = 1;
  
  zoomIn() {
    this.imageScale = Math.min(this.imageScale + 0.2, 3);
  }

  zoomOut() {
    this.imageScale = Math.max(this.imageScale - 0.2, 0.5);
  }

  resetZoom() {
    this.imageScale = 1;
  }

  constructor(private apicall: ApicallService, private modalService: NgbModal,private encservice:CryptoService) { }

  ngOnInit() {
    this.approvermenuselect = this.apicall.approvermenuselect;
    this.getApproverCancelledData();
  }

  getApproverCancelledData() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

    
    const data = {
      zone: userData?.zone || '',
      division: userData?.division || ''
    };

    this.isLoading = true;
    this.apicall.formapplicationgetcancelled(data).subscribe({
      next: (res: any) => {
       // //console.log(res);
        if (Array.isArray(res.data)) {
          this.idcardsList = res.data;
          this.filteredidcardsList = [...this.idcardsList];
        } else {
          console.error('Unexpected response format: not an array', res);
          this.idcardsList = [];
          this.filteredidcardsList = [];
          this.errorMessage = 'Invalid data format received from server';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API call failed:', err);
        this.errorMessage = 'Failed to fetch cancelled ID cards';
        this.isLoading = false;
      }
    });
  }

  filteridcards() {
    if (!this.searchText) {
      this.filteredidcardsList = [...this.idcardsList];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredidcardsList = this.idcardsList.filter(item =>
      (item.contract_station_name?.toLowerCase()?.includes(searchLower) || false) ||
      (item.first_name?.toLowerCase()?.includes(searchLower) || false) ||
      (item.designation?.toLowerCase()?.includes(searchLower) || false) ||
      (item.type_of_card?.toLowerCase()?.includes(searchLower) || false)
    );
  }

  ViewIdcarddetails(content: any, idcard: any) {
    this.selectedIdcard = idcard;
    const payload = {
      form_id: idcard.id
    };

    this.isLoading = true;
    this.apicall.getVerifiedData(payload).subscribe({
      next: (res: any) => {
      //  //console.log(res);
        if (res) {
          this.selectedIdcard = res;
          this.modalRef = this.modalService.open(content, { size: 'lg' });
        } else {
          this.errorMessage = 'No verified data available';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch verified data:', err);
        this.errorMessage = 'Failed to load verified data';
        this.isLoading = false;
      }
    });
  }

  forwardIdCard() {
    if (!this.selectedIdcard) {
      this.errorMessage = 'No ID card selected';
      return;
    }

    const payload = {
      id: this.selectedIdcard.form_id
    };
////console.log(payload);
    this.isLoading = true;
    this.apicall.officerIdCardCancelApprove(payload).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'ID Card cancelled successfully!';
        this.isLoading = false;
        this.closeModal();
        this.getApproverCancelledData();
      },
      error: (err) => {
        console.error('Forwarding failed:', err);
        this.errorMessage = err.error?.message || 'Failed to cancel ID Card';
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
    this.successMessage = null;
    this.errorMessage = null;
    this.selectedFile = null;
    this.selectedFileName = null;
    this.isLoading = false;
  }

  selectFile(url: string, fileName: string) {
    if (!url) {
      this.errorMessage = `${fileName} is not available`;
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
}