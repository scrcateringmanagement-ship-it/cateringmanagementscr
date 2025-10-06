import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inspection-fine-paid',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PdfViewerModule],
  templateUrl: './inspection-fine-paid.component.html',
  styleUrl: './inspection-fine-paid.component.css'
})
export class InspectionFinePaidComponent {
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
  selectedFile: string | null = null; // Track the selected file URL
  selectedFileName: string | null = null; // Track the selected file name
  imageScale: number = 1;
  inspdata: any[] = [];
  inspdatabyid: any = null; // Add this property
    payment_date: any = null;
    receipt_number: any = null;
    paid_amount:  any = null;
    paid_location: any = null;
    prosecuted_amount: any = null;


  constructor(private apicall: ApicallService, private modalService: NgbModal) {}

  ngOnInit() {
    this.ccimenuselect = this.apicall.ccimenuselect;
    this.getCciInspectionData();
  }

  getCciInspectionData() {  
  this.apicall.getInspectionPaidData().subscribe({   
      next: (res: any) => {
        //console.log('Inspection Data:', res);
        if (res && res.finePaymentInspections) {
          // Convert to array if single object
          this.inspdata = Array.isArray(res.finePaymentInspections) 
            ? res.finePaymentInspections 
            : [res.finePaymentInspections];
          
          if (this.inspdata.length === 0) {
            this.errorMessage = 'No inspection records found.';
          }
        } else {
          console.error('Response format:', res);
          this.inspdata = [];
          this.errorMessage = res?.message || 'No inspection data available in the response.';
        }
      },
      error: (err) => {
        console.error('API call failed:', err);
        this.errorMessage = err?.error?.message || err?.message || 'Failed to load inspection data. Please try again later.';
        this.inspdata = [];
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
          // Set paid_amount to fine_imposed
          if (this.inspdatabyid) {
            this.inspdatabyid.paid_amount = this.inspdatabyid.fine_imposed;
          }
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
  savePaymentDetails() {
    if (!this.inspdatabyid || !this.selectedFormId) {
      this.errorMessage = 'No inspection selected.';
      return;
    }

    const payload = {
      inspectionId: this.selectedFormId,
      paymentDate: this.inspdatabyid.payment_date,
      recieptNumber: this.inspdatabyid.receipt_number,
      paidAmount: this.inspdatabyid.paid_amount,
      paidLocation: this.inspdatabyid.paid_location,
      prosecuted_amount: this.inspdatabyid.prosecuted_amount || 0,
    };

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apicall.saveInspectionPaymentDetails(payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'Payment details saved successfully';
        this.getCciInspectionData(); // Refresh the list
        this.isLoading = false;
        this.closeModal(); // Close the modal after successful save
      },
      error: (err) => {
        console.error('Failed to save payment details:', err);
        this.errorMessage = 'Failed to save payment details.';
        this.isLoading = false;
      }
    });
  }
}