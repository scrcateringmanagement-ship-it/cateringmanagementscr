import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CryptoService } from '../services/crypto.service';


interface FileErrors {
  [key: string]: string;
}

@Component({
  selector: 'app-registrationforidcards',
  standalone: true,
  templateUrl: './registrationforidcards.component.html',
  styleUrls: ['./registrationforidcards.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegistrationComponent implements OnInit {
  isAutoFilled = false;
  position: any = null;
  positions: any[] = [];
  contractDetails: any = null;
  aadharExist: boolean = false;

  fromDate: string = '';
  toDate: string = '';
  dateError: boolean = false;

  private crypto = inject(CryptoService)





  constructor(private regService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Get contract data from localStorage
    this.loadContractData();
    this.getVendorPositions();
  }



  onDateChange() {
    if (!this.fromDate || !this.toDate) {
      this.lastPaidDate = '';
      this.dateError = false;
      return;
    }

    if (this.fromDate > this.toDate) {
      this.dateError = true;
      this.lastPaidDate = '';
    } else {
      this.dateError = false;
      this.lastPaidDate = `${this.fromDate} to ${this.toDate}`;
    }
  }
  isEmployeeLimitReached(): boolean {
    if (!this.contractDetails) return false;

    const allowed = this.contractDetails.contract_details_no_of_employees || 0;
    const current = this.contractDetails.current_count || 0;

    return current >= allowed;
  }



  getVendorPositions() {
    this.regService.getvendorposition().subscribe({
      next: (res) => {
      //  console.log('position data', res);
        this.positions = res; // assign the array of positions directly
      },
      error: (err) => {
        console.error('Error fetching positions:', err);
      },
      complete: () => {
        //console.log('Position fetch complete');
      }
    });
  }
  onPositionChange(name: any) {
    // //console.log("selected position "  , selected)
    this.designation = name;
  }


  loadContractData(): void {
    // Try to get the contract data from localStorage
    const storedContract = this.crypto.getItem('selectedContract');
    //console.log('Retrieved stored contract:', storedContract);

    if (storedContract) {
      try {
        const contract = JSON.parse(storedContract);
        //console.log('Parsed contract data:', contract);
        this.autoFillFields(contract);
        this.isAutoFilled = true;
        this.contractDetails = contract;
      } catch (error) {
        console.error('Error parsing stored contract:', error);
      }
    } else {
      //console.log('No contract data found in localStorage');
    }
  }

  autoFillFields(contract: any): void {
    //console.log('Auto-filling fields with contract data:', contract);

    // Map contract properties to form fields with safer property access
    this.licenseName = contract?.Licensee_name || "";
    this.contractCode = contract?.contract_code || "";
    this.contractName = contract?.contract_stall || "";
    this.station = contract?.contract_station_name || "";
    this.division = contract?.Lincensee_division || "";
    this.zone = contract?.Lincensee_zone || "";
    this.phoneNumber = contract?.Licensee_mobile || "";
    // this.licenseeRemarks = contract?.contract_details_remarks || "";
    this.location = contract?.contract_location || "";
    this.periodStartDate = contract.contract_details_start_date || "";
    this.periodEndDate = contract.contract_details_end_date || "";
    this.licenceId = contract?.licensee_id || "";
    this.firmname = contract?.Licensee_firm_name || "";

    // Set date of application to today if not provided
    if (contract?.date_of_application) {
      this.dateOfApplication = contract.date_of_application;
    } else {
      this.dateOfApplication = this.todayDate();
    }

    // abc//console.log('Fields after auto-fill:', {
    //   licenseName: this.licenseName,
    //   licenceId: this.licenceId,
    //   contractCode: this.contractCode,
    //   contractName: this.contractName,
    //   station: this.station,
    //   division: this.division,
    //   zone: this.zone,
    //   phoneNumber: this.phoneNumber,
    //   firmname: this.firmname,
    //   periodStartDate: this.periodStartDate,
    //   periodEndDate: this.periodEndDate,
    // });
  }

  // Application-specific fields
  contractName = "";
  periodStartDate = "";
  periodEndDate = "";
  dateOfApplication = "";
  contractCode = "";
  licenseName = "";
  location = "";
  station = "";
  firmname = "";
  licenceId = "";

  blood_group = "";



  // Basic user information
  division = '';
  zone = '';
  firstName = '';
  middleName = '';
  lastName = '';
  email = 'example@domain.com';
  gender = 'Male'; // Default value
  civilStatus = '';
  securityQuestion = '';
  securityAnswer = '';
  year = '0'; // Default value

  // ID Card information
  name = '';
  designation = '';
  dob = '';
  typeOfCard = 'new'; // Default value
  aadharNumber = '';
  phoneNumber = '';
  address = '';

  // Police verification details
  policeStation = '';
  policeCertNo = '';
  policeCertDate = '';

  // Medical examination details
  medicalBy = '';
  medicalDate = '';
  medicalValidUpto = '';

  // Last paid details
  lastPaidDate = '';
  licenseeRemarks = '';

  // File URLs (after upload)
  photoUrl: string | null = null;
  policeCertFileUrl: string | null = null;
  medicalCertFileUrl: string | null = null;


  annexure_two_url: string | null = null;
  annexure_three_url: string | null = null;

  aadharCardFileUrl: string | null = null;
  vendorSignatureFileUrl: string | null = null;
  moneyReceiptFileUrl: string = "*";
  lastPaidFileUrl: string | null = null;
  ddMrFileUrl: string | null = null;

  // File objects
  photo: File | null = null;
  policeCertFile: File | null = null;
  medicalCertFile: File | null = null;
  annexure_two_file: File | null = null;
  annexure_three_file: File | null = null;

  aadharCardFile: File | null = null;
  vendorSignatureFile: File | null = null;
  moneyReceiptFile: File | null = null;
  lastPaidFile: File | null = null;
  ddMrFile: File | null = null;

  // Error and success messages
  errorMsg = ''; // For frontend validation errors
  backendErrorMsg = ''; // For backend errors
  successMsg = '';
  fileError: FileErrors = {
    photo: '',
    policeCertFile: '',
    medicalCertFile: '',

    annexure_two_file: '',
    annexure_three_file: '',
    aadharCardFile: '',
    vendorSignatureFile: '',
    moneyReceiptFile: '',
    lastPaidFile: '',
    ddMrFile: ''
  };

  // Loading states
  loadingPhoto = false;
  loadingAnnexureTwo = false;
  loadingAnnexureThree = false;

  loadingPoliceCert = false;
  loadingMedicalCert = false;
  loadingAadharCard = false;
  loadingVendorSignature = false;
  loadingMoneyReceipt = false;
  loadingLastPaid = false;
  loadingDdMr = false;

  /**
   * Checks if a specific file field has an error
   */
  hasFileError(fieldName: string): boolean {
    return fieldName in this.fileError && this.fileError[fieldName] !== '';
  }

  /**
   * Gets the error message for a specific file field
   */
  getFileErrorMessage(fieldName: string): string {
    return fieldName in this.fileError ? this.fileError[fieldName] : '';
  }

  /**
   * Simple file upload method for all file types
   */
  UploadFile(event: any, operation: string) {
    const file = event.target.files[0];
    const inputElement = event.target as HTMLInputElement;

    if (file) {
      // Clear previous errors
      this.fileError[operation] = '';

      // File size validation (1MB = 1048576 bytes)
      if (file.size > 2097152) {
        this.fileError[operation] = 'File size exceeds 2MB';
        if (inputElement) inputElement.value = '';
        return;
      }

      // File type validation
      if (operation === 'photo') {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          this.fileError[operation] = 'Only JPEG/JPG or png files are allowed';
          if (inputElement) inputElement.value = '';
          return;
        }
      } else {
        // Other fields allow JPEG, JPG, PNG
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          this.fileError[operation] = 'Only JPEG, JPG, or PNG files are allowed';
          if (inputElement) inputElement.value = '';
          return;
        }
      }

      // Set loading state
      this.setLoadingState(operation, true);

      // Store the file object
      (this as any)[operation] = file;

      const formData = new FormData();
      formData.append('file', file);

      this.regService.uploadFilePhoto(formData).subscribe({
        next: (res) => {
          // Set the URL based on operation type

          switch (operation) {
            case 'photo':
              this.photoUrl = res.path;
              break;
            case 'policeCertFile':
              this.policeCertFileUrl = res.path;
              break;


            case 'annexure_two_file':
              this.annexure_two_url = res.path;
              break;
            case 'annexure_three_file':
              this.annexure_three_url = res.path;
              break;

            case 'medicalCertFile':
              this.medicalCertFileUrl = res.path;
              break;

            case 'aadharCardFile':
              this.aadharCardFileUrl = res.path;
              break;
            case 'vendorSignatureFile':
              this.vendorSignatureFileUrl = res.path;
              break;
            case 'moneyReceiptFile':
              this.moneyReceiptFileUrl = res.path;
              break;

            case 'lastPaidFile':
              this.lastPaidFileUrl = res.path;
              break;
            case 'ddMrFile':
              this.ddMrFileUrl = res.path;
              break;
          }

          // console.log(`${operation} uploaded successfully:`, res.path);
          this.setLoadingState(operation, false);
        },
        error: (err) => {
          console.error(`${operation} upload failed:`, err);
          this.fileError[operation] = `Upload failed: ${err.message || 'Server error'}`;
          this.setLoadingState(operation, false);

          // Clear the file input
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


  // Set loading state for specific file field
  setLoadingState(fieldName: string, isLoading: boolean) {
    switch (fieldName) {
      case 'photo': this.loadingPhoto = isLoading; break;
      case 'policeCertFile': this.loadingPoliceCert = isLoading; break;
      case 'medicalCertFile': this.loadingMedicalCert = isLoading; break;

      case 'annexure_two_file': this.loadingAnnexureTwo = isLoading; break;
      case 'annexure_three_file': this.loadingAnnexureThree = isLoading; break;

      case 'aadharCardFile': this.loadingAadharCard = isLoading; break;
      case 'vendorSignatureFile': this.loadingVendorSignature = isLoading; break;
      case 'moneyReceiptFile': this.loadingMoneyReceipt = isLoading; break;
      case 'lastPaidFile': this.loadingLastPaid = isLoading; break;
      case 'ddMrFile': this.loadingDdMr = isLoading; break;
    }
  }


  /**
   * Validates the form before submission
   */
  validateForm(): boolean {
    this.errorMsg = ''; // Clear previous frontend errors

    // Check required text/select fields
    if (!this.firstName || !this.lastName || !this.email ||
      !this.name || !this.gender || !this.civilStatus || !this.lastPaidDate || !this.licenseeRemarks || !this.blood_group ||
      !this.dateOfApplication || !this.division || !this.phoneNumber || !this.medicalValidUpto || !this.medicalDate ||
      !this.year || !this.typeOfCard || !this.designation || !this.position || !this.licenceId || !this.dob
      || !this.email || !this.aadharNumber || !this.policeCertNo || !this.policeStation || !this.policeCertDate ||
      !this.contractCode || !this.periodStartDate || !this.periodEndDate || !this.licenseName || !this.station || !this.firmname) {
      this.errorMsg = 'Please fill in all required fields marked with *.';
      return false;
    }

    // Check for required photo
    if (!this.photoUrl && !this.loadingPhoto) {
      this.fileError['photo'] = 'Employee photo is required.';
      this.errorMsg = 'Please upload the required photo.';
      return false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMsg = 'Please enter a valid email address.';
      return false;
    }

    // Aadhar validation if provided
    if (this.aadharNumber && !/^\d{12}$/.test(this.aadharNumber)) {
      this.errorMsg = 'Aadhar number must be 12 digits.';
      return false;
    }

    // Phone validation if provided
    if (this.phoneNumber && !/^\d{10}$/.test(this.phoneNumber)) {
      this.errorMsg = 'Phone number must be 10 digits.';
      return false;
    }

    // Check if any file uploads are still in progress
    if (this.loadingPhoto || this.loadingPoliceCert || this.loadingMedicalCert ||
      this.loadingAadharCard || this.loadingVendorSignature || this.loadingMoneyReceipt ||
      this.loadingLastPaid || this.loadingDdMr) {
      this.errorMsg = 'Please wait for all file uploads to complete.';
      return false;
    }

    // Check for file errors detected during upload
    for (const field in this.fileError) {
      if (this.fileError.hasOwnProperty(field) && this.fileError[field]) {
        this.errorMsg = `Please fix the error with the file: ${field}.`;
        return false;
      }
    }

    return true; // All frontend checks passed
  }

  /**
   * Handles form submission
   */
  submitForm(form: NgForm) {
    this.errorMsg = '';
    this.backendErrorMsg = '';
    this.successMsg = '';

    if (!this.validateForm()) {
      // Form validation failed
      return;
    }

    // Double check form validity state
    if (!form.valid) {
      this.errorMsg = 'Please ensure all fields are correctly filled.';
      // Mark all fields as touched to show errors
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    // Check if required file uploads are present
    if (!this.photoUrl) {
      this.errorMsg = 'Employee photo is required.';
      return;
    }

    if (!this.policeCertFileUrl) {
      this.errorMsg = 'Police certificate file is required.';
      return;
    }




    if (!this.medicalCertFileUrl) {
      this.errorMsg = 'Medical certificate file is required.';
      return;
    }
    if (!this.annexure_two_url) {
      this.errorMsg = 'annexure_two certificate file is required.';
      return;
    }
    if (!this.annexure_three_url) {
      this.errorMsg = 'annexure_three certificate file is required.';
      return;
    }

    if (!this.aadharCardFileUrl) {
      this.errorMsg = 'Aadhar card file is required.';
      return;
    }

    if (!this.vendorSignatureFileUrl) {
      this.errorMsg = 'Vendor signature file is required.';
      return;
    }

    if (!this.lastPaidFileUrl) {
      this.errorMsg = 'Last paid file is required.';
      return;
    }

    if (!this.ddMrFileUrl) {
      this.errorMsg = 'DD/MR file is required.';
      return;
    }

    // Format date fields to ensure consistency
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      } catch (e) {
        return dateStr;
      }
    };

    // Create an object with text fields and file URLs
    // Using snake_case for field names to match backend expectations
    const formData = {
      // Application-specific fields
      contract_code: this.contractCode || '',
      license_name: this.licenseName || '',
      licensee_id: this.licenceId || '',
      location: this.location || '',
      station: this.station || '',
      contract_name: this.contractName || '',
      date_of_application: formatDate(this.dateOfApplication) || '',

      // Basic user information
      division: this.division || '',
      zone: this.zone || '',
      contract_details_start_date: this.periodStartDate || '',
      contract_details_end_date: this.periodEndDate || '',
      first_name: this.firstName || '',
      middle_initial: this.middleName || '',
      last_name: this.lastName || '',
      email: this.email || '',
      gender: this.gender || '',
      civil_status: this.civilStatus || '',
      security_question: this.securityQuestion || '',
      security_answer: this.securityAnswer || '',
      position: this.position || '',
      year: this.year || '',

      // ID card information
      name: this.name || '',
      designation: this.designation || '',
      dob: formatDate(this.dob) || '',
      type_of_card: this.typeOfCard || '',
      aadhar_number: this.aadharNumber || '',
      phone_number: this.phoneNumber || '',
      address: this.address || '',
      blood_group: this.blood_group || '',

      // Police verification details
      police_station: this.policeStation || '',
      police_cert_no: this.policeCertNo || '',
      police_cert_date: formatDate(this.policeCertDate) || '',

      // Medical examination details
      medical_by: this.medicalBy || '',
      medical_date: formatDate(this.medicalDate) || '',
      medical_valid_upto: formatDate(this.medicalValidUpto) || '',

      // Last paid details
      last_paid_date: formatDate(this.lastPaidDate) || '',
      licensee_remarks: this.licenseeRemarks || '',

      // File URLs (after upload)
      photo: this.photoUrl || '',
      police_cert_file: this.policeCertFileUrl || '',
      medical_cert_file: this.medicalCertFileUrl || '',
      annexure_two_file: this.annexure_two_url || '',
      annexure_three_file: this.annexure_three_url || '',
      aadhar_card_file: this.aadharCardFileUrl || '',
      vendor_signature_file: this.vendorSignatureFileUrl || '',
      money_receipt_file: this.moneyReceiptFileUrl || '',
      last_paid_file: this.lastPaidFileUrl || '',
      dd_mr_file: this.ddMrFileUrl || ''

    };







    console.log("Form data being sent:", formData);

    // Submit the form data to the backend
    this.regService.insertContractTextDetails(formData).subscribe({

      next: (response: any) => {
        this.router.navigate(['/applycard']);
        //console.log('Form submission response:', response);

        if (response.success) {
          this.successMsg = 'Registration successful!';
          alert(this.successMsg);
        } else {
          this.backendErrorMsg = response.message || 'Registration failed. Please check your data and try again.';
          alert(this.backendErrorMsg);
        }
        console.log(formData)
      },
      error: (err: any) => {
        console.error('Registration failed', err);
        this.successMsg = '';

        // Handle specific validation errors if available
        if (err?.error?.errors) {
          const validationErrors = err.error.errors;
          let errorMessage = 'Validation failed:\n';

          // Extract specific validation error messages
          for (const field in validationErrors) {
            if (validationErrors.hasOwnProperty(field)) {
              errorMessage += `${field}: ${validationErrors[field].join(', ')}\n`;
            }
          }

          this.backendErrorMsg = errorMessage;
          alert(this.backendErrorMsg); // Show validation errors
        } else {
          this.backendErrorMsg = err?.error?.message || err?.message || 'Registration failed due to a server error. Please try again.';
          alert(this.backendErrorMsg); // Show general error
        }
      }
    });
  }

  /**
   * Returns the current date in YYYY-MM-DD format
   */

  todayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }





  check_Aadhar(): void {
    if (this.aadharNumber && /^\d{12}$/.test(this.aadharNumber)) {
      const checkadhardata = { aadhar_number: this.aadharNumber };

      this.regService.validate_Aadhar(checkadhardata).subscribe({
        next: (response: any) => {
          this.aadharExist = response.status === true;
        },
        error: (err) => {
          console.error('Aadhar validation failed', err);
          this.aadharExist = false;
        }
      });
    } else {
      this.aadharExist = false;
    }
  }


}
