import { Component } from '@angular/core';
import { ApicallService } from '../apicall.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-completed-idcards',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PdfViewerModule],
  templateUrl: './completed-idcards.component.html',
  styleUrls: ['./completed-idcards.component.css']
})
export class CompletedIdcardsComponent {
  searchText: string = '';
  filteredidcardsList: any[] = [];
  idcardsList: any[] = [];
  selectedIdcard: any = null;
  errorMessage: string | null = null;
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
  imageScale: number = 1;

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

  constructor(private apicall: ApicallService, private modalService: NgbModal, private encservice: CryptoService) { }

  ngOnInit() {
    this.getExpiredApplications();
  }

  getExpiredApplications() {
    this.apicall.getExpiredApplications().subscribe({
      next: (res: any) => {
        console.log('Expired Applications:', res);
        if (Array.isArray(res.data)) {
          this.idcardsList = res.data;
          this.filteredidcardsList = [...this.idcardsList];
        } else {
          console.error('Unexpected response format: not an array', res);
          this.idcardsList = [];
          this.filteredidcardsList = [];
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (err) => {
        console.error('API call failed:', err);
        this.errorMessage = 'Failed to load expired applications.';
      }
    });
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
    console.log('Selected expired application details:', this.selectedIdcard);
    const payload = {
      form_id: this.selectedIdcard.id
    };
    console.log('Payload for verified data:', payload);

    this.apicall.getVerifiedData(JSON.stringify(payload)).subscribe({
      next: (res: any) => {
        console.log('Verified Data:', res);
        if (res) {
          if (res.valid_upto) {
            const date = new Date(res.valid_upto);
            res.valid_upto = date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
          }
          this.selectedIdcard = res;
          console.log('Selected expired application details:', this.selectedIdcard);
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

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.selectedIdcard = null;
    this.successMessage = null;
    this.errorMessage = null;
    this.isLoading = false;
  }

  openFile(url: string) {
    if (!url) return;
    const ext = url.split('.').pop()?.toLowerCase();
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
    return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '');
  }

  isPdf(url: string): boolean {
    if (!url) return false;
    const ext = url.split('.').pop()?.toLowerCase();
    return ext === 'pdf';
  }

  async generatePDF(idcard: any) {
    const payload = { form_id: idcard.id };
    this.apicall.getVerifiedData(JSON.stringify(payload)).subscribe({
      next: async (res: any) => {
        if (res) {
          if (res.valid_upto) {
            const date = new Date(res.valid_upto);
            res.valid_upto = date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
          }
          const data = res;

          // Function to convert image URL to base64
          const urlToBase64 = async (url: string): Promise<string> => {
            try {
              const response = await fetch(url);
              const blob = await response.blob();
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error('Failed to convert image to base64:', error);
              return url; // Fallback to original URL
            }
          };

          // Build HTML content
          let htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Expired Application Details</h2>
              <div style="display: flex;">
                <div style="flex: 1; padding-right: 20px;">
                  <p><strong>Name:</strong> ${data.first_name} ${data.middle_initial} ${data.last_name}</p>
                  <p><strong>Aadhar Number:</strong> ${data.aadhar_number}</p>
                  <p><strong>Date of Birth:</strong> ${new Date(data.dob).toLocaleDateString('en-IN')}</p>
                  <p><strong>Gender:</strong> ${data.gender}</p>
                  <p><strong>Blood Group:</strong> ${data.blood_group}</p>
                  <p><strong>Civil Status:</strong> ${data.civil_status}</p>
                  <p><strong>Address:</strong> ${data.address}</p>
                  <p><strong>Phone Number:</strong> ${data.phone_number}</p>
                  <p><strong>Email:</strong> ${data.email}</p>
                  <p><strong>Designation:</strong> ${data.designation}</p>
                  <p><strong>Position:</strong> ${data.position}</p>
                  <p><strong>Card Type:</strong> ${data.type_of_card}</p>
                  <p><strong>Date of Application:</strong> ${new Date(data.date_of_application).toLocaleDateString('en-IN')}</p>
                  <p><strong>Zone:</strong> ${data.zone}</p>
                  <p><strong>Division:</strong> ${data.division}</p>
                  <p><strong>Station:</strong> ${data.station}</p>
                  <p><strong>Location:</strong> ${data.location}</p>
                  <p><strong>Contract Code:</strong> ${data.contract_code}</p>
                  <p><strong>Contract Start Date:</strong> ${new Date(data.contract_details_start_date).toLocaleDateString('en-IN')}</p>
                  <p><strong>Contract End Date:</strong> ${new Date(data.contract_details_end_date).toLocaleDateString('en-IN')}</p>
                  <p><strong>Contract Stall:</strong> ${data.contract_stall}</p>
                  <p><strong>Medical By:</strong> ${data.medical_by}</p>
                  <p><strong>Medical Date:</strong> ${new Date(data.medical_date).toLocaleDateString('en-IN')}</p>
                  <p><strong>Medical Valid Upto:</strong> ${new Date(data.medical_valid_upto).toLocaleDateString('en-IN')}</p>
                  <p><strong>Police Cert No:</strong> ${data.police_cert_no}</p>
                  <p><strong>Police Cert Date:</strong> ${new Date(data.police_cert_date).toLocaleDateString('en-IN')}</p>
                  <p><strong>Police Station:</strong> ${data.police_station}</p>
                  <p><strong>LF/PLF/FINE/PI Paid Period:</strong> ${data.last_paid_date.split(' to ')[0]} to ${data.last_paid_date.split(' to ')[1]}</p>
                  <p><strong>Licensee Remarks:</strong> ${data.licensee_remarks}</p>
                  <p><strong>CCI Remarks:</strong> ${data.cci_accpet_remarks}</p>
                  <p><strong>Office User Remarks:</strong> ${data.officer_accept_remarks}</p>
                  <p><strong>Id Card Validity:</strong> ${data.valid_upto}</p>
                  <p><strong>Approver Sign:</strong> ${data.approver_sign}</p>
                  <p><strong>Year:</strong> ${data.year}</p>
                  <p><strong>Print Status:</strong> ${data.print_status}</p>
                  <p><strong>Status Update:</strong> ${data.status_update}</p>
                </div>
                <div style="flex: 1; padding-left: 20px;">
          `;

          const files = [
            { title: 'Aadhaar Card', key: 'aadhar_card_file' },
            { title: 'Photo', key: 'photo' },
            { title: 'Annexure One Certificate', key: 'medical_cert_file' },
            { title: 'Annexure Two Certificate', key: 'annexure_two_file' },
            { title: 'Annexure Three Certificate', key: 'annexure_three_file' },
            { title: 'Police Certificate', key: 'police_cert_file' },
            { title: 'LF/PLF/Fine/PI Advice Notice', key: 'last_paid_file' },
            { title: 'LF Paid Receipt', key: 'dd_mr_file' },
            { title: 'Vendor Signature', key: 'vendor_signature_file' },
            { title: 'QR Code', key: 'qr_url' }
          ];

          for (const file of files) {
            if (data[file.key]) {
              if (this.isImage(data[file.key])) {
                const base64Src = await urlToBase64(data[file.key]);
                htmlContent += `<h4>${file.title}</h4><img src="${base64Src}" style="max-width: 100%; height: auto; margin-bottom: 20px;" />`;
              } else if (this.isPdf(data[file.key])) {
                htmlContent += `<h4>${file.title}</h4><p>PDF file: ${data[file.key]}</p>`;
              }
            }
          }

          htmlContent += `
                </div>
              </div>
            </div>
          `;

          // PDF options
          const options = {
            margin: 0.5,
            filename: `expired-idcard-${data.contract_code || 'unknown'}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
          };

          html2pdf().from(htmlContent).set(options).save();
        } else {
          alert('No verified data available for PDF generation.');
        }
      },
      error: (err) => {
        console.error('Failed to fetch verified data for PDF:', err);
        alert('Failed to load data for PDF generation.');
      }
    });
  }
}
