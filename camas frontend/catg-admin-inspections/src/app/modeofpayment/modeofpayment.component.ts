import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-modeofpayment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './modeofpayment.component.html',
  styleUrl: './modeofpayment.component.css'
})
export class ModeofpaymentComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  paymentForm: FormGroup;
  modalTitle: string = 'Add New Mode of Payment';
  isEditMode: boolean = false;
  editingPayment: any = null;
  searchText: string = '';
  paymentList: any[] = [];
  filteredPaymentList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.paymentForm = this.fb.group({
      mode_of_payment: ['', Validators.required]  // Changed from modeofpayment
    });
  }

  ngOnInit() {
    this.getPayments();
  }

  getPayments() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });
    
    this.apicall.getModeOfPayment(data).subscribe({
      next: (res: any) => {
        this.paymentList = res;
        this.filteredPaymentList = [...this.paymentList];
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
        alert('Failed to fetch payments. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.paymentForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      mode_of_payment: this.paymentForm.get('mode_of_payment')?.value,  // Changed from modeofpayment
      id: this.isEditMode ? this.editingPayment.id : null,
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    };

    if (this.isEditMode) {
      this.apicall.updateModeOfPayment(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getPayments();
          this.modalService.dismissAll();
          alert('Mode of Payment updated successfully!');
        },
        error: (err) => {
          console.error('Error updating payment:', err);
          alert('Failed to update payment. Please try again.');
        }
      });
    } else {
      this.apicall.insertModeOfPayment(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getPayments();
          this.modalService.dismissAll();
          alert('Mode of Payment added successfully!');
        },
        error: (err) => {
          console.error('Error adding payment:', err);
          alert('Failed to add payment. Please try again.');
        }
      });
    }
  }

  deletePayment(payment: any): void {
    if (confirm(`Are you sure you want to delete payment "${payment.mode_of_payment}"?`)) {  // Changed from modeofpayment
      const data = {
        id: payment.id
      };
      
      this.apicall.deleteModeOfPayment(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getPayments();
          alert('Mode of Payment deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting payment:', err);
          alert('Failed to delete payment. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterPayments(): void {
    if (!this.searchText) {
      this.filteredPaymentList = [...this.paymentList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredPaymentList = this.paymentList.filter(payment =>
      payment.mode_of_payment?.toLowerCase().includes(searchTerm)  // Changed from modeofpayment
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Mode of Payment';
    this.isEditMode = false;
    this.editingPayment = null;
    this.paymentForm.reset();
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editPayment(payment: any): void {
    this.paymentForm.patchValue({
      mode_of_payment: payment.mode_of_payment  // Changed from modeofpayment
    });
    
    this.modalTitle = 'Edit Mode of Payment';
    this.isEditMode = true;
    this.editingPayment = payment;
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}
