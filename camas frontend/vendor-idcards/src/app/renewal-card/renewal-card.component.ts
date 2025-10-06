import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FileUploadService } from '../file-upload.service';
import { SafeUrlPipe } from '../safe-url.pipe';
import { CryptoService } from '../services/crypto.service';


interface RenewalCard {
  id: number;
  first_name: string;
  middle_initial: string;
  last_name: string;
  contract_code: string;
  location: string;
  licensee_id: string | number;
  zone: string;
  division: string;
  date_of_application: string;
  medical_valid_upto: string;
  photo: string;
  police_cert_file: string;
  medical_cert_file: string;
  aadhar_card_file: string;
  vendor_signature_file: string;
  money_receipt_file: string;
  last_paid_file: string;
  dd_mr_file: string;
  licensee_remarks: string;
  email: string;
  phone_number: string;
  aadhar_number: string;
  police_cert_no: string;
  police_cert_date: string;
  police_station: string;
  medical_by: string;
  medical_date: string;
  designation: string;
  name: string;
  dob: string;
  type_of_card: string;
  address: string;
  civil_status: string;
  gender: string;
  blood_group: string;

  security_question: string;
  security_answer: string;
  position: string;
  year: string;
  username: string;
  last_paid_date: string;
  contract_name: string;
  contract_details_start_date: string;
  contract_details_end_date: string;
  license_name?: string;
  station?: string;
  annexure_two_file: string;
  annexure_three_file: string;
  verified_approveds?: VerifiedApproved[];
}

interface VerifiedApproved {
  cci_reject_remarks: String;
  officer_reject_remarks: string
}

interface FileErrors {
  [key: string]: string;
}

@Component({
  selector: 'app-renewal-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SafeUrlPipe],
  templateUrl: './renewal-card.component.html',
  styleUrls: ['./renewal-card.component.css'],
  providers: [DatePipe]
})
export class RenewalCardComponent implements OnInit {

  private crypto = inject(CryptoService);

  renewalCards: RenewalCard[] = [];
  positions: any[] = [];
  selectedCard: RenewalCard | null = null;
  showEditModal = false;
  showImageModal = false;
  selectedImage = '';
  loading = false;
  error = '';
  updateForm: FormGroup;
  submitting = false;
  filterData: any = null;
  confirmDeleteModalOpen = false;
  fileToDelete: string = '';
  fileFieldToDelete: string = '';
  imageLoadError = false;

  designation: string = '';

  // File upload statuses - using same naming as registration
  loadingPhoto = false;
  loadingPoliceCert = false;
  loadingMedicalCert = false;
  loadingAadharCard = false;
  loadingVendorSignature = false;
  loadingMoneyReceipt = false;
  loadingLastPaid = false;
  loadingDdMr = false;

  loadingAnnexureTwo = false;
  loadingAnnexureThree = false;

  // File replacement flags
  replacePhoto = false;
  replacePoliceCert = false;
  replaceMedicalCert = false;
  replaceAadharCard = false;
  replaceVendorSignature = false;
  replaceMoneyReceipt = false;
  replaceLastPaid = false;
  replaceDdMr = false;
  replaceAnnexureTwo = false;
  replaceAnnexureThree = false;

  // File upload errors - using same structure as registration
  fileError: FileErrors = {
    photo: '',
    policeCertFile: '',
    medicalCertFile: '',
    aadharCardFile: '',
    vendorSignatureFile: '',
    moneyReceiptFile: '',
    lastPaidFile: '',
    ddMrFile: '',
    annexureTwoFile: '',
    annexureThreeFile: '',

  };

  // File URLs - using same naming as registration
  photoUrl: string | null = null;
  policeCertFileUrl: string | null = null;
  medicalCertFileUrl: string | null = null;
  aadharCardFileUrl: string | null = null;
  vendorSignatureFileUrl: string | null = null;
  moneyReceiptFileUrl: string | null = null;
  lastPaidFileUrl: string | null = null;
  ddMrFileUrl: string | null = null;
  annexureTwoFileUrl: string | null = null;
  annexureThreeFileUrl: string | null = null;

  // File objects - using same naming as registration
  photo: File | null = null;
  policeCertFile: File | null = null;
  medicalCertFile: File | null = null;
  aadharCardFile: File | null = null;
  vendorSignatureFile: File | null = null;
  moneyReceiptFile: File | null = null;
  lastPaidFile: File | null = null;
  ddMrFile: File | null = null;
  annexureTwoFile: File | null = null;
  annexureThreeFile: File | null = null;

  // Control select element state
  selectReadOnly = true;

  constructor(
    private authService: AuthService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.updateForm = this.fb.group({
      id: [''],
      first_name: ['', Validators.required],
      middle_initial: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      username: [''],
      blood_group: ['', Validators.required],
      gender: ['', Validators.required],
      civil_status: ['', Validators.required],
      security_question: [''],
      security_answer: [''],
      position: ['', Validators.required],
      year: [''],
      name: ['', Validators.required],
      designation: ['', Validators.required],
      dob: ['', Validators.required],
      type_of_card: [''],
      aadhar_number: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      address: ['', Validators.required],
      contract_code: [''],
      license_name: [''],
      licensee_id: [''],
      location: [''],
      station: [''],
      contract_name: [''],
      date_of_application: [''],
      division: ['', Validators.required],
      zone: ['', Validators.required],
      contract_details_start_date: ['', Validators.required],
      contract_details_end_date: ['', Validators.required],
      police_station: ['', Validators.required],
      police_cert_no: ['', Validators.required],
      police_cert_date: ['', Validators.required],
      medical_by: ['', Validators.required],
      medical_date: ['', Validators.required],
      medical_valid_upto: ['', Validators.required],
      last_paid_date: ['', Validators.required],
      licensee_remarks: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getFilterDataAndFetchCards();
    this.getVendorPositions();
  }

  getFilterDataAndFetchCards(): void {
    try {
      const storedContract = this.crypto.getItem('IndividualData');
      if (storedContract) {
        try {
          const contract = JSON.parse(storedContract);

          this.filterData = {
            licensee_id: contract.licensee_id || 0,
            contract_code: contract.contract_code || '',
            division: contract.Lincensee_division || '',
            zone: contract.Lincensee_zone || ''
          };

         
          //console.log('Constructed filter data from contract:', this.filterData);
          this.fetchRenewalCards();
        } catch (parseError) {
          console.error('Error parsing selectedContractDetails:', parseError);
          this.error = 'Error parsing stored contract data. Using default filters.';
          this.fetchRenewalCards();
        }
      } else {
        //console.log('No selectedContractDetails found in localStorage');
        this.error = 'No contract found. Using default filters.';
        this.fetchRenewalCards();
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      this.fetchRenewalCards();
    }
  }


  fetchRenewalCards(): void {
    this.loading = true;
    this.error = '';
    const filters = this.filterData || {};
    console.log(filters);
    this.authService.getRenewalCards(filters).subscribe({
      next: (response) => {
        console.log(response);
        if (response && response.data) {
          this.renewalCards = response.data;
        } else {
          this.renewalCards = Array.isArray(response) ? response : [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load renewal applications. Please try again.';
        this.loading = false;
        console.error('Error fetching renewal cards:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || 'N/A';
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    return imagePath;
  }

  hasValidFile(filePath: string): boolean {
    return !!(filePath && filePath.trim() !== '' && filePath !== 'null');
  }

  openEditModal(card: RenewalCard): void {
    this.selectedCard = { ...card };
    this.resetFileReplacementFlags();
    this.clearFileErrors();
    this.selectReadOnly = true;

    if (!this.positions || this.positions.length === 0) {
      this.getVendorPositions();
    }

    this.photoUrl = this.getFullImageUrl(card.photo) || null;
    this.policeCertFileUrl = this.getFullImageUrl(card.police_cert_file) || null;
    this.medicalCertFileUrl = this.getFullImageUrl(card.medical_cert_file) || null;
    this.aadharCardFileUrl = this.getFullImageUrl(card.aadhar_card_file) || null;
    this.vendorSignatureFileUrl = this.getFullImageUrl(card.vendor_signature_file) || null;
    this.moneyReceiptFileUrl = this.getFullImageUrl(card.money_receipt_file) || null;
    this.lastPaidFileUrl = this.getFullImageUrl(card.last_paid_file) || null;
    this.ddMrFileUrl = this.getFullImageUrl(card.dd_mr_file) || null;
    this.annexureTwoFileUrl = this.getFullImageUrl(card.annexure_two_file) || null;
    this.annexureThreeFileUrl = this.getFullImageUrl(card.annexure_three_file) || null;

    this.designation = card.designation || '';

    this.updateForm.patchValue({
      id: card.id,
      first_name: card.first_name || '',
      middle_initial: card.middle_initial || '',
      last_name: card.last_name || '',
      email: card.email || '',
      phone_number: card.phone_number || '',
      username: card.username || '',
      gender: card.gender || '',
      civil_status: card.civil_status || '',
      security_question: card.security_question || '',
      security_answer: card.security_answer || '',
      position: card.position || '',
      year: card.year || '',
      name: card.name || '',
      designation: card.designation || '',
      dob: card.dob || '',
      type_of_card: card.type_of_card || '',
      aadhar_number: '',
      address: card.address || '',
      contract_code: card.contract_code || '',
      license_name: card.license_name || '',
      licensee_id: card.licensee_id || '',
      location: card.location || '',
      station: card.station || '',
      contract_name: card.contract_name || '',
      date_of_application: card.date_of_application || '',
      division: card.division || '',
      zone: card.zone || '',
      contract_details_start_date: card.contract_details_start_date || '',
      contract_details_end_date: card.contract_details_end_date || '',
      police_station: card.police_station || '',
      police_cert_no: card.police_cert_no || '',
      police_cert_date: card.police_cert_date || '',
      medical_by: card.medical_by || '',
      medical_date: card.medical_date || '',
      medical_valid_upto: card.medical_valid_upto || '',
      last_paid_date: card.last_paid_date || '',
      licensee_remarks: card.licensee_remarks || '',
      blood_group: card.blood_group || ''
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCard = null;
    this.updateForm.reset();
    this.clearFileErrors();
    this.resetFileReplacementFlags();
    this.clearFileUrls();
  }

  clearFileUrls(): void {
    this.photoUrl = null;
    this.policeCertFileUrl = null;
    this.medicalCertFileUrl = null;
    this.aadharCardFileUrl = null;
    this.vendorSignatureFileUrl = null;
    this.moneyReceiptFileUrl = null;
    this.lastPaidFileUrl = null;
    this.ddMrFileUrl = null;

    this.annexureTwoFileUrl = null;
    this.annexureThreeFileUrl = null;
  }

  clearFileErrors(): void {
    this.fileError = {
      photo: '',
      policeCertFile: '',
      medicalCertFile: '',
      aadharCardFile: '',
      vendorSignatureFile: '',
      moneyReceiptFile: '',
      lastPaidFile: '',
      ddMrFile: '',
      annexureTwoFile: '',
      annexureThreeFile: ''

    };
  }

  resetFileReplacementFlags(): void {
    this.replacePhoto = false;
    this.replacePoliceCert = false;
    this.replaceMedicalCert = false;
    this.replaceAadharCard = false;
    this.replaceVendorSignature = false;
    this.replaceMoneyReceipt = false;
    this.replaceLastPaid = false;
    this.replaceDdMr = false;
    this.replaceAnnexureTwo = false;
    this.replaceAnnexureThree = false;
  }

  viewImage(imageUrl: string): void {
    this.selectedImage = this.getFullImageUrl(imageUrl);
    this.showImageModal = true;
    this.imageLoadError = false;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImage = '';
    this.imageLoadError = false;
  }

  onImageError(event: any): void {
    console.error('Failed to load image:', this.selectedImage);
    console.error('Image error event:', event);

    const img = event.target as HTMLImageElement;
    console.error('Failed URL from img element:', img.src);

    this.imageLoadError = true;
  }

  testImageUrl(imagePath: string): void {
    const url = this.getFullImageUrl(imagePath);

    const testImg = new Image();
    testImg.onload = () => {};
    testImg.onerror = () => {};
    testImg.src = url;
  }

  confirmDeleteFile(fileField: string, fileUrl: string): void {
    if (!fileUrl) {
      console.warn('No file URL to delete for field:', fileField);
      return;
    }
    this.fileToDelete = fileUrl;
    this.fileFieldToDelete = fileField;
    this.confirmDeleteModalOpen = true;
  }

  cancelDeleteFile(): void {
    this.confirmDeleteModalOpen = false;
    this.fileToDelete = '';
    this.fileFieldToDelete = '';
  }

  deleteFile(): void {
    if (!this.selectedCard || !this.fileFieldToDelete || !this.fileToDelete) {
      this.error = 'Cannot delete file: Missing card data, field identifier, or file URL.';
      this.cancelDeleteFile();
      return;
    }

    const loadingFieldName = this.getFileFieldForLoading(this.fileFieldToDelete);
    this.setLoadingState(loadingFieldName, true);

    this.authService.deleteFile(this.fileToDelete).subscribe({
      next: (response) => {

        if (this.selectedCard) {
          (this.selectedCard as any)[this.fileFieldToDelete] = '';

          this.clearFileUrlByField(this.fileFieldToDelete);

          this.toggleReplaceFile(loadingFieldName, true);
        }

        this.setLoadingState(loadingFieldName, false);
        this.confirmDeleteModalOpen = false;
        alert('File deleted successfully! You can now upload a new file.');
      },
      error: (err) => {
        console.error('Error deleting file:', err);
        this.fileError[loadingFieldName] = `Failed to delete file: ${err.message || 'Server error'}`;
        this.setLoadingState(loadingFieldName, false);
        this.confirmDeleteModalOpen = false;
        alert(`Error deleting file: ${err.message || 'Server error'}`);
      }
    });
  }

  clearFileUrlByField(dbFieldKey: string): void {
    switch (dbFieldKey) {
      case 'photo': this.photoUrl = null; break;
      case 'police_cert_file': this.policeCertFileUrl = null; break;
      case 'medical_cert_file': this.medicalCertFileUrl = null; break;
      case 'aadhar_card_file': this.aadharCardFileUrl = null; break;
      case 'vendor_signature_file': this.vendorSignatureFileUrl = null; break;
      case 'money_receipt_file': this.moneyReceiptFileUrl = null; break;
      case 'last_paid_file': this.lastPaidFileUrl = null; break;
      case 'dd_mr_file': this.ddMrFileUrl = null; break;
      case 'annexure_two_file': this.annexureTwoFileUrl = null; break;
      case 'annexure_three_file': this.annexureThreeFileUrl = null; break;
    }
  }

  getFileFieldForLoading(dbFieldKey: string): string {
    switch (dbFieldKey) {
      case 'photo': return 'photo';
      case 'police_cert_file': return 'policeCertFile';
      case 'medical_cert_file': return 'medicalCertFile';
      case 'aadhar_card_file': return 'aadharCardFile';
      case 'vendor_signature_file': return 'vendorSignatureFile';
      case 'money_receipt_file': return 'moneyReceiptFile';
      case 'last_paid_file': return 'lastPaidFile';
      case 'dd_mr_file': return 'ddMrFile';
      case 'annexure_two_file': return 'annexureTwoFile';
      case 'annexure_three_file': return 'annexureThreeFile';
      default:
        console.warn('Unknown dbFieldKey in getFileFieldForLoading:', dbFieldKey);
        return dbFieldKey;
    }
  }

  activateSelect(): void {
    this.selectReadOnly = false;
  }

  hasFileError(fieldName: string): boolean {
    return fieldName in this.fileError && this.fileError[fieldName] !== '';
  }

  getFileErrorMessage(fieldName: string): string {
    return fieldName in this.fileError ? this.fileError[fieldName] : '';
  }

  UploadFile(event: any, operation: string) {
    const file = event.target.files[0];
    const inputElement = event.target as HTMLInputElement;

    if (file) {
      this.fileError[operation] = '';

      if (file.size > 2097152) {
        this.fileError[operation] = 'File size exceeds 2MB';
        if (inputElement) inputElement.value = '';
        return;
      }

      if (operation === 'photo') {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          this.fileError[operation] = 'Only JPEG/JPG files are allowed';
          if (inputElement) inputElement.value = '';
          return;
        }
      } else {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          this.fileError[operation] = 'Only JPEG, JPG, or PNG files are allowed';
          if (inputElement) inputElement.value = '';
          return;
        }
      }

      this.setLoadingState(operation, true);

      (this as any)[operation] = file;

      const formData = new FormData();
      formData.append('file', file);

      this.authService.uploadFilePhoto(formData).subscribe({
        next: (res) => {
          switch (operation) {
            case 'photo':
              this.photoUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.photo = res.path;
              }
              break;
            case 'policeCertFile':
              this.policeCertFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.police_cert_file = res.path;
              }
              break;
            case 'medicalCertFile':
              this.medicalCertFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.medical_cert_file = res.path;
              }
              break;
            case 'aadharCardFile':
              this.aadharCardFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.aadhar_card_file = res.path;
              }
              break;
            case 'vendorSignatureFile':
              this.vendorSignatureFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.vendor_signature_file = res.path;
              }
              break;
            case 'moneyReceiptFile':
              this.moneyReceiptFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.money_receipt_file = res.path;
              }
              break;
            case 'lastPaidFile':
              this.lastPaidFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.last_paid_file = res.path;
              }
              break;

            case 'annexureTwoFile':
              this.annexureTwoFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) this.selectedCard.annexure_two_file = res.path;
              break;
            case 'annexureThreeFile':
              this.annexureThreeFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) this.selectedCard.annexure_three_file = res.path;
              break;

            case 'ddMrFile':
              this.ddMrFileUrl = this.getFullImageUrl(res.path);
              if (this.selectedCard) {
                this.selectedCard.dd_mr_file = res.path;
              }
              break;
          }

          this.setLoadingState(operation, false);
          this.toggleReplaceFile(operation, false);
        },
        error: (err) => {
          console.error(`${operation} upload failed:`, err);
          this.fileError[operation] = `Upload failed: ${err.message || 'Server error'}`;
          this.setLoadingState(operation, false);

          if (inputElement) inputElement.value = '';
          (this as any)[operation] = null;
        }
      });
    } else {
      console.error('No file selected');
      this.fileError[operation] = '';
      (this as any)[operation] = null;
    }
  }

  setLoadingState(fieldName: string, isLoading: boolean) {
    switch (fieldName) {
      case 'photo': this.loadingPhoto = isLoading; break;
      case 'policeCertFile': this.loadingPoliceCert = isLoading; break;
      case 'medicalCertFile': this.loadingMedicalCert = isLoading; break;
      case 'aadharCardFile': this.loadingAadharCard = isLoading; break;
      case 'vendorSignatureFile': this.loadingVendorSignature = isLoading; break;
      case 'moneyReceiptFile': this.loadingMoneyReceipt = isLoading; break;
      case 'lastPaidFile': this.loadingLastPaid = isLoading; break;
      case 'ddMrFile': this.loadingDdMr = isLoading; break;
      case 'annexureTwoFile': this.loadingAnnexureTwo = isLoading; break;
      case 'annexureThreeFile': this.loadingAnnexureThree = isLoading; break;
    }
  }

  submitUpdate(): void {
    if (this.updateForm.invalid) {
      Object.keys(this.updateForm.controls).forEach(key => {
        this.updateForm.get(key)?.markAsTouched();
      });
      alert('Please fill all required fields correctly.');
      return;
    }

    if (!this.selectedCard) {
      this.error = 'No card selected for update.';
      alert(this.error);
      return;
    }

    this.submitting = true;
    this.error = '';

    const updateData: any = {
      ...this.updateForm.value,
      photo: this.photoUrl || this.selectedCard.photo,
      police_cert_file: this.policeCertFileUrl || this.selectedCard.police_cert_file,
      medical_cert_file: this.medicalCertFileUrl || this.selectedCard.medical_cert_file,
      aadhar_card_file: this.aadharCardFileUrl || this.selectedCard.aadhar_card_file,
      vendor_signature_file: this.vendorSignatureFileUrl || this.selectedCard.vendor_signature_file,
      money_receipt_file: this.moneyReceiptFileUrl || this.selectedCard.money_receipt_file,
      last_paid_file: this.lastPaidFileUrl || this.selectedCard.last_paid_file,
      dd_mr_file: this.ddMrFileUrl || this.selectedCard.dd_mr_file,
      annexure_two_file: this.annexureTwoFileUrl || this.selectedCard.annexure_two_file,
      annexure_three_file: this.annexureThreeFileUrl || this.selectedCard.annexure_three_file
    };

    this.authService.renewApplication(updateData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.closeEditModal();
        alert('Application updated successfully!');
        this.fetchRenewalCards();
      },
      error: (err) => {
        this.submitting = false;
        const message = err.error?.message || err.message || 'Failed to update application. Please try again.';
        this.error = message;
        console.error('Error updating renewal card:', err);
        alert(`Update failed: ${message}`);
      }
    });
  }

  toggleReplaceFile(fileType: string, forceState?: boolean): void {
    switch (fileType) {
      case 'photo':
        this.replacePhoto = forceState !== undefined ? forceState : !this.replacePhoto;
        if (this.replacePhoto) this.fileError['photo'] = '';
        break;
      case 'policeCertFile':
        this.replacePoliceCert = forceState !== undefined ? forceState : !this.replacePoliceCert;
        if (this.replacePoliceCert) this.fileError['policeCertFile'] = '';
        break;
      case 'medicalCertFile':
        this.replaceMedicalCert = forceState !== undefined ? forceState : !this.replaceMedicalCert;
        if (this.replaceMedicalCert) this.fileError['medicalCertFile'] = '';
        break;
      case 'aadharCardFile':
        this.replaceAadharCard = forceState !== undefined ? forceState : !this.replaceAadharCard;
        if (this.replaceAadharCard) this.fileError['aadharCardFile'] = '';
        break;
      case 'vendorSignatureFile':
        this.replaceVendorSignature = forceState !== undefined ? forceState : !this.replaceVendorSignature;
        if (this.replaceVendorSignature) this.fileError['vendorSignatureFile'] = '';
        break;
      case 'moneyReceiptFile':
        this.replaceMoneyReceipt = forceState !== undefined ? forceState : !this.replaceMoneyReceipt;
        if (this.replaceMoneyReceipt) this.fileError['moneyReceiptFile'] = '';
        break;
      case 'lastPaidFile':
        this.replaceLastPaid = forceState !== undefined ? forceState : !this.replaceLastPaid;
        if (this.replaceLastPaid) this.fileError['lastPaidFile'] = '';
        break;
      case 'ddMrFile':
        this.replaceDdMr = forceState !== undefined ? forceState : !this.replaceDdMr;
        if (this.replaceDdMr) this.fileError['ddMrFile'] = '';
        break;

      case 'annexureTwoFile':
        this.replaceAnnexureTwo = forceState !== undefined ? forceState : !this.replaceAnnexureTwo;
        if (this.replaceAnnexureTwo) this.fileError['annexureTwoFile'] = '';
        break;
      case 'annexureThreeFile':
        this.replaceAnnexureThree = forceState !== undefined ? forceState : !this.replaceAnnexureThree;
        if (this.replaceAnnexureThree) this.fileError['annexureThreeFile'] = '';
        break;
    }
  }

  getFieldDisplayName(fileType: string): string {
    switch (fileType) {
      case 'photo': return 'Photo';
      case 'policeCertFile': case 'police_cert_file': return 'Police Certificate';
      case 'medicalCertFile': case 'medical_cert_file': return 'Medical Certificate';
      case 'aadharCardFile': case 'aadhar_card_file': return 'Aadhar Card';
      case 'vendorSignatureFile': case 'vendor_signature_file': return 'Vendor Signature';
      case 'moneyReceiptFile': case 'money_receipt_file': return 'Money Receipt';
      case 'lastPaidFile': case 'last_paid_file': return 'Last Paid Receipt';
      case 'ddMrFile': case 'dd_mr_file': return 'DD/MR File';
      case 'annexureTwoFile': case 'annexure_two_file': return 'Annexure Two';
      case 'annexureThreeFile': case 'annexure_three_file': return 'Annexure Three';
      default: return fileType.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
    }
  }

  hasFile(fileUrl: string | undefined | null): boolean {
    return !!fileUrl && fileUrl.trim() !== '';
  }

  getVendorPositions(): void {
    this.authService.getvendorposition().subscribe({
      next: (res) => {
        if (res && Array.isArray(res)) {
          this.positions = res;
        } else if (res && res.data && Array.isArray(res.data)) {
          this.positions = res.data;
        } else {
          this.positions = [];
          console.warn('Unexpected position data structure:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching positions:', err);
        this.positions = [];
      }
    });
  }

  onPositionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedPositionName = target.value;

    if (selectedPositionName) {
      const selectedPosition = this.positions.find(pos =>
        pos.vendorPositionName === selectedPositionName
      );

      if (selectedPosition) {
        this.designation = selectedPosition.vendorPositionName;

        this.updateForm.patchValue({
          position: selectedPositionName,
          designation: this.designation
        });
      } else {
        this.designation = selectedPositionName;
        this.updateForm.patchValue({
          position: selectedPositionName,
          designation: this.designation
        });
      }
    } else {
      this.designation = '';
      this.updateForm.patchValue({
        position: '',
        designation: ''
      });
    }
  }
}
