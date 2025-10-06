import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-cci-role-get-rejected-idcards',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PdfViewerModule],
  templateUrl: './cci-role-get-rejected-idcards.component.html',
  styleUrl: './cci-role-get-rejected-idcards.component.css'
})
export class CciRoleGetRejectedIdcardsComponent {
  searchText: string = '';
  filteredidcardsList: any[] = [];
  idcardsList: any[] = [];
  selectedIdcard: any = null;
  errorMessage: string | null = null;
  remarks: string = '';
  ccimenuselect: boolean = false;
  successMessage: string | null = null;
  isLoading: boolean = false;
  private modalRef: NgbModalRef | null = null;

  constructor(private apicall: ApicallService, private modalService: NgbModal,private encservice:CryptoService) {}

  ngOnInit() {
    this.ccimenuselect = this.apicall.ccimenuselect;

    this.getCciIdcardRejectData();
  }

  getCciIdcardRejectData() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user')||'{}')
  //console.log(userstoragedecryptData);
  const userData = JSON.parse(userstoragedecryptData);

    const data = JSON.stringify({
      zone: userData?.zone,
      division: userData?.division,
      section: userData?.location
    });

    //console.log('send Data:', data);
    if (this.apicall.ccimenuselect === true) {
      this.apicall.getCciRejectedData(data).subscribe({
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
        }
      });
    } else {

      this.apicall.getCciIdcardsendData(data).subscribe({
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
        }
      });

    }
  }

  filteridcards() {
    if (!this.searchText) {
      this.filteredidcardsList = [...this.idcardsList];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredidcardsList = this.idcardsList.filter(item =>
        item.contract_station_name?.toLowerCase().includes(searchLower) ||
        item.first_name?.toLowerCase().includes(searchLower) ||
        item.designation?.toLowerCase().includes(searchLower) ||
        item.type_of_card?.toLowerCase().includes(searchLower)
      );
    }
  }

  ViewIdcarddetails(content: any, idcard: any) {
    this.selectedIdcard = idcard;
    this.remarks = ''; // Reset remarks for forward/reject
    const payload = {
      form_id: this.selectedIdcard.id
    };

    this.apicall.getVerifiedData(JSON.stringify(payload)).subscribe({
      next: (res: any) => {
        //console.log('Verified Data:', res);
        if (res) {
          this.selectedIdcard = res;
          //console.log('Selected ID card details:', this.selectedIdcard);
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
    if (!this.selectedIdcard) return;

    const payload = {
      "id_form_application": this.selectedIdcard.id,
      "sender": 'cci',
      "transcation": "a",
      "remarks": this.remarks,
      "signature": "Signed by CCI"
    };

    this.apicall.cciIdCardApprove(payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'ID Card forwarded successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getCciIdcardRejectData(); // Refresh data
        }, 2000);
      },
      error: (err) => {
        console.error('Forwarding failed:', err);
        alert('Failed to forward ID Card.');
      }
    });
  }

  rejectIdCard() {
    if (!this.selectedIdcard) return;

    const payload = {
      id_form_application: this.selectedIdcard.id,
      sender: 'cci',
      "transcation": "r",
      remarks: this.remarks,
      "signature": "Signed by CCI"
    };

    this.apicall.cciIdCardReject(payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'ID Card rejected successfully!';
        setTimeout(() => {
          this.closeModal();
          this.getCciIdcardRejectData(); // Refresh data
        }, 2000);
      },
      error: (err) => {
        console.error('Rejection failed:', err);
        alert('Failed to reject ID Card.');
      }
    });
  }

  closeModal() {
    this.selectedIdcard = null;
    this.remarks = ''; // Reset remarks
    this.successMessage = null; // Reset success message
  }

  openFile(url: string) {
    if (!url) {
      this.errorMessage = 'File URL is not available.';
      return;
    }
    const ext = url.split('.').pop()?.toLowerCase();
    const features = 'width=1000,height=800,top=100,left=100,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes';
    window.open(url, '_blank', features);
  }

}