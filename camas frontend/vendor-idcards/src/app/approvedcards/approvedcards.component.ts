import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-approvedcards',
  templateUrl: './approvedcards.component.html',
  styleUrls: ['./approvedcards.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ApprovedcardsComponent implements OnInit {
  applications: any[] = [];
  printedApps = new Set<number>();
  loading = false;
  error: string | null = null;

  // Modal properties
  showModal = false;
  modalImageUrl = '';
  modalTitle = '';
  modalType: 'image' | 'pdf' = 'image';
  imageLoadError = false;

  lf = 'LEFT';
  ri = 'RIGHT';
  Photo: any;
  private crypto = inject(CryptoService);




  constructor(private authService: AuthService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadContractData();
    this.loadApplications();
  }

  filters = {
    zone: '',
    division: '',
    licensee_id: 0,
    contract_code: ''
  };

  loadContractData(): void {
    const storedContract = this.crypto.getItem('IndividualData');
    if (storedContract) {
      try {
        const contract = JSON.parse(storedContract);
        this.filters = {
          licensee_id: contract.licensee_id,
          contract_code: contract.contract_code || '',
          division: contract.Lincensee_division || '',
          zone: contract.Lincensee_zone || ''
        };
        //console.log('Loaded filters:', this.filters);
      } catch (error) {
        console.error('Error parsing stored contract:', error);
      }
    } else {
      console.warn('No selectedContractDetails found in localStorage');
    }
  }

  loadApplications(): void {
    //console.log('Starting to load applications with filters:', this.filters);
    this.loading = true;
    this.error = null;

    this.authService.Approvecards(this.filters).subscribe({
      next: (response) => {
        console.log('Full API Response:', response);
        //console.log('Response type:', typeof response);
        //console.log('Response keys:', Object.keys(response || {}));

        // Try different possible response structures
        if (response?.approved_applications) {
          this.applications = response.approved_applications;
          //console.log('Found approved_applications array:', this.applications);
        } else if (response?.data) {
          this.applications = response.data;
          //console.log('Found data array:', this.applications);
        } else if (Array.isArray(response)) {
          this.applications = response;
          //console.log('Response is direct array:', this.applications);
        } else {
          console.error('Unexpected response structure:', response);
          this.applications = [];
        }

        //console.log('Final applications array:', this.applications);
        //console.log('Applications count:', this.applications.length);

        this.loading = false;

        // Convert "yes"/"no" print_status into printedApps Set
        this.printedApps.clear();
        this.applications.forEach((app, index) => {
          //console.log(`App ${index}:`, app);
          const alreadyPrinted = app.print_status === 'yes';
          if (alreadyPrinted) {
            this.printedApps.add(app.id);
          }
        });

        //console.log('Printed apps set:', this.printedApps);
      },
      error: (err) => {
        console.error('Error fetching applications:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          error: err.error
        });
        this.error = 'Failed to load applications. Please try again.';
        this.loading = false;
        this.applications = []; // Ensure it's empty on error
      }
    });
  }

  // Add a method to manually refresh data for debugging
  refreshData(): void {
    //console.log('Manual refresh triggered');
    this.loadApplications();
  }

  // Add a method to check current state
  debugCurrentState(): void {
    //console.log('=== CURRENT COMPONENT STATE ===');
    //console.log('Loading:', this.loading);
    //console.log('Error:', this.error);
    //console.log('Applications:', this.applications);
    //console.log('Applications length:', this.applications?.length);
    //console.log('Filters:', this.filters);
    //console.log('PrintedApps:', this.printedApps);
    //console.log('==============================');
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      //console.log("base not req", imagePath);
      return imagePath;
    }

    return imagePath;
  }




  cancel(application: any): void {
    if (!confirm(`Are you sure you want to cancel the ID for ${application.first_name} ${application.last_name}?`)) {
      return;
    }

    const cancelData = {
      id: application.id,
      remarks: 'I declare the Employee is not working in this unit kindly cancel to apply for another employee'

    };

    //  this.authService.cancel(application.id).subscribe

    this.authService.cancel(cancelData).subscribe({
      next: () => {
        alert('Application cancelled successfully.');
        // Optionally remove the application from UI
        this.applications = this.applications.filter(app => app.id !== application.id);
      },
      error: (err) => {
        console.error('Error cancelling application:', err);
        alert('Failed to cancel application. Please try again later.');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-IN');
  }

  get printedDate(): string {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  getSafeImageUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Updated QR Code URL method to use the new logic
  getQRCodeUrl(app: any): string {
    if (!app.qr_url) return '';

    // Use the same logic as getFullImageUrl
    return this.getFullImageUrl(app.qr_url);
  }

  // Updated viewImage method - matching applied cards
  viewImage(fileUrl: string): void {
    //console.log('Raw fileUrl:', fileUrl);
    const imageUrl = this.getFullImageUrl(fileUrl);
    //console.log('Opening modal with image:', imageUrl);
    this.modalImageUrl = imageUrl;
    this.showModal = true;
    this.imageLoadError = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalImageUrl = '';
    this.imageLoadError = false;
  }

  // Handle image load errors with debugging - matching applied cards
  onImageError(event: any): void {
    console.error('Failed to load image:', this.modalImageUrl);
    console.error('Image error event:', event);

    // Log the constructed URL for debugging
    const img = event.target as HTMLImageElement;
    console.error('Failed URL from img element:', img.src);

    this.imageLoadError = true;
  }

  // Check if file exists/is valid - matching applied cards
  hasValidFile(filePath: string): boolean {
    return !!(filePath && filePath.trim() !== '' && filePath !== 'null');
  }

  // Debug method to test URL accessibility - matching applied cards
  testImageUrl(imagePath: string): void {
    const url = this.getFullImageUrl(imagePath);
    //console.log('Testing URL:', url);

    // Create a test image element
    const testImg = new Image();
    testImg.onload = () => //console.log('✓ Image loaded successfully:', url);
      testImg.onerror = () => {
        //console.log('✗ Image failed to load:', url);

      };
    testImg.src = url;
  }
  getPositionClass(position: string): string {
    if (!position) return '';
    return 'position-' + position.toLowerCase().replace(/\s+/g, '-');
  }

  printApplication(application: any): void {
    this.authService.printedIdSave(application.id).subscribe({
      next: (response: any) => {
        console.log("data comming see", response);
        const alreadyPrinted = response?.alreadyPrinted || response?.print_status === 'yes';

        if (alreadyPrinted) {
          alert('This ID card has already been printed. Reprint not allowed.');
          return;
        }
        // Proceed to print
        const front = this.generateFrontHTML(application);
        const back = this.generateBackHTML(application);
        const positionClass = this.getPositionClass(application.position || '');
        console.log("position data", positionClass); // Enable this to debug
        const printWindow = window.open('', '_blank', 'width=1200,height=800');

        if (printWindow) {
          printWindow.document.write(`
          <html>
            <head>
              <title>ID Card - ${application.first_name} ${application.last_name}</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${this.getIdCardCSS()}</style>
            </head>
            <body>
              <div class="id-card-wrapper">
                <div class="cards-container">
                  <div class="card-section">
                    <div class="card-label">Front</div>
                    <div class="${positionClass}">
                    <div class="id-container">
                      ${front}
                    </div>
                    </div>
                  </div>
                  <div class="card-section">
                    <div class="card-label">Back</div>
                    <div class="${positionClass}">
                    <div class="back-id-container">
                      ${back}
                    </div>
                    <div>
                  </div>
                </div>
              </div>
              <script>
                window.onload = function () {
                  setTimeout(function () {
                    window.focus();
                    window.print();
                    window.onafterprint = function () {
                      window.close();
                    };
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
          printWindow.document.close();
        }

        // Mark locally as printed
        this.printedApps.add(application.id);
      },
      error: (err) => {
        console.error('Error checking print status:', err);
        alert('Failed to verify print status. Try again later.');
      }
    });
  }

  getIdCardCSS(): string {
    return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Times New Roman';
   color: black;
}

.id-card-wrapper {
  background-color: #f0f0f0;
  padding: 20px;
  min-height: 100vh;
}

.print-controls {
  text-align: center;
  margin-bottom: 20px;
}

.print-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.print-btn:hover {
  background-color: #c82333;
}

.cards-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}

.card-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-label {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
}

.id-container,
.back-id-container {
  width: 54mm;
  height: 87mm;
  border: 2px solid rgb(0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: start;
  background-color: #FF4D00 !important;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  align-items: center;
  margin: 15px 0 0 15px;
  gap: 10px;
}

.id-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
  border-radius: 3px;
}

.text-block p {
  margin: 0;
  text-align: center;
}

#p1 {
  font-size: 14px;
  font-weight: bold;
}

#p2 {
  font-size: 8px;
}

.photo-container {
  margin: 15px 0 0 20px;
  width: 4.2cm;
  height: 4.85cm;
  border: 1px solid black;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f9f9f9;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sign-container {
  margin: 0px 0 0 20px;
  padding: 1px;
  width: 4.2cm;
  height: 0.95cm;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  overflow: hidden;
  text-align: center;
}

.sign-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h3 {
  font-size: 14px;
  margin-left: 15px;
  margin-top: 8px;
}

h6 {
  font-size: 10px;
  margin-left: auto;
  margin-right: 15px;
  margin-top: 20px;
}

.back-id-container {
  padding: 8px;
}

.image-row {
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
}

.image-row img {
  width: 2.35cm;
  height: 2.5cm;
  border: 1px solid #000;
  object-fit: cover;
}

.department {
  margin: 15px 15px 0px 0px;
  padding: 20px;
  width: 4.95cm;
  height: 0.75cm;
  border: 1px solid black;
  display: flex;
  justify-content: center;  
  align-items: center;
  background-color: #f9f9f9;
  color :black;
  overflow: hidden;
}

.department p {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.text-context {
  padding: 2px;
}

#number {
  font-size: 20px;
  padding: 5px;
  text-align: center;
}

#aadharNumber {
  font-size: 14px;
  padding-top: 10px;
  margin-bottom: 0;
  text-align: center;
}

.text-context h5 {
  padding: 2px;
  font-size: 10px;
  margin: 0;
  font-weight: bold;
}

hr {
  margin: 0;
  border: 1px solid black;
  margin-top: 4px;
  margin-bottom: 10px;
}

#name {
  font-size: 16px;
  margin: 2px;
  text-align: center;
  font-weight: bold;
}

.instruction {
  font-size: 8px;
  text-align: center;
  margin-top: 8px;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .cards-container {
    flex-direction: column;
    align-items: center;
  }
}

@media print {
  .id-card-wrapper {
    background-color: white;
    padding: 0;
    min-height: auto;
  }

  .print-controls {
    display: none !important;
  }

  .cards-container {
    gap: 10mm;
    margin: 0;
    padding: 0;
  }

  .card-label {
    display: none;
  }

  .id-container,
  .back-id-container {
    box-shadow: none;
    margin: 0;
  }

  .card-section {
    margin: 0;
    padding: 0;
  }
}
.headsign {
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  margin: 2px 0;
  line-height: 1;
}

.center-text {
  text-align: center;
  margin: 0;
  padding: 0;
}

.center-text h6 {
  margin: 2px 0;
  font-size: 10px;
  line-height: 1;
}



.grade-box {
  width: 2.35cm;
  height: 2.5cm;
  border: 1px solid #000;
  background-color: #ffffff;
  color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: bold;
  object-fit: cover;
}
.info-field {
  display: flex;
  align-items: flex-start;
  margin: 1px 0;
  font-size: 11px;
  color: white !important;   
  width: 180px;
}

.info-field strong {
 
  color: white !important;  
    flex: 0 0 90px;  
 
  margin-right: 5px;
}

.info-field span {
  flex: 1;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.0;
  max-height: 2.0em;
  overflow: hidden;
}
#license_name,
#valid_upto {
  color: white !important;
   text-align: center; 
}

/* Their labels also white */
.info-field strong {
  color: white !important;
}
}


/* Stall Vendor */
.position-stall-vendor .id-container,
.position-stall-vendor .back-id-container,
.position-manager .id-container,
.position-manager .back-id-container {
background-color: #FF4D00 !important;
color: black !important;
}

/* Juice Maker, Peeler, PF Vendor */
.position-juice-maker .id-container,
.position-juice-maker .back-id-container,
.position-peeler .id-container,
.position-peeler .back-id-container,
.position-pf-vendor .id-container,
.position-pf-vendor .back-id-container {
background-color: #FF4D00 !important;
color: white !important;
}
`;
  }

  generateFrontHTML(app: any): string {
    // Updated to use the new image URL logic
    const signaUrl = this.getFullImageUrl(app.vendor_signature_file);
    const photoUrl = this.getFullImageUrl(app.photo);
    const qrcode = this.getQRCodeUrl(app);

    //console.log("photourl", photoUrl);
    //console.log("signatureurl", signaUrl);
    //console.log("qrcode", qrcode);

    return `
                  <div class="header-container">
                      <img src="./assets/originallogo.png" alt="Indian Railway Logo" class="id-logo" />
                      <div class="text-block">
                          <p id="p1">Indian Railway</p>
                          <p id="p2">ID Card No ${app.id}</p>
                      </div>
                  </div>

                  <div class="photo-container" id="photo">
                      <img src="${photoUrl}" alt="Photo Placeholder" />
                  </div>

                  <div class="sign-container" id="sign">
                      <img src="${signaUrl}" alt="Signature Placeholder" />
                  </div>
                  

                  <h3 id="name">Name: ${app.name || 'N/A'}</h3>

               <div class="center-text">
  <h6>Issuing Authority:</h6>
  <h6 class="headsign">${app?.approver_sign || 'N/A'}</h6>
</div>

  `;
  }
  generateBackHTML(app: any): string {
    // format date safely
    let validDate = 'N/A';
    if (app.valid_upto) {
      const d = new Date(app.valid_upto);
      //validDate = d.toLocaleDateString('en-GB').replace(/\//g, '-'); // dd-MM-yyyy
      validDate = d.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).replace(/\//g, '-');

    }

    return `
    <div class="image-row">
        <img src="${app.qr_url || ''}" alt="QR Code" />

        <div class="grade-box">
            ${app.blood_group || 'A'}
        </div>
    </div>
    <div class="department" id="dept">
        <p>${app.designation || 'Department'}</p>
    </div>
    <div class="text-context">
        <h5 id="number">${app.phone_number || '667472375727'}</h5>
        <h5 id="aadharNumber">${app.aadhar_number || '65665778786'}</h5>
      
        <div class="info-field">
            <strong>Licensee:</strong>
            <span id="license_name">${app.license_name || 'N/A'}</span>
        </div>

         <div class="info-field">
            <strong>Unit No:</strong>
            <span id="license_name">${app.contract_code || 'N/A'}</span>
        </div>
           
        <hr>
        <div class="info-field">
            <strong>Valid upto:</strong>
            <span id="valid_upto">${validDate}</span>
        </div>

        <pre class="instruction">
<b>Instructions</b>
This ID card is property of Indian Railway. If found,
please return to nearest railway office.
        </pre>
    </div>
  `;


    //   generateBackHTML(app: any): string {
    //     return `
    //                   <div class="image-row">
    //                       <img src="${app.qr_url || ''}" alt="QR Code" />

    //                       <div class="grade-box">
    //                           ${app.blood_group || 'A'}
    //                       </div>
    //                   </div>
    //                   <div class="department" id="dept">
    //                       <p>${app.designation || 'Department'}</p>
    //                   </div>
    //                   <div class="text-context">
    //                       <h5 id="number">${app.phone_number || '667472375727'}</h5>
    //                       <h5 id="aadharNumber">${app.aadhar_number || '65665778786'}</h5>

    //                   <div class="info-field">
    //                  <strong>Licensee:</strong>
    //                   <span id="license_name">${app.license_name || 'N/A'}</span>
    //                   </div>

    //                       <hr>
    //               <div class="info-field">
    //                       <strong>Valid:</strong>
    //                       <span id="valid_upto">{{ app.valid_upto ? (app.valid_upto | date:'dd-MM-yyyy') : 'N/A' }}</span>

    //                       </div>
    //                       <pre class="instruction">
    // <b>Instructions</b>
    // This ID card is property of Indian Railway. If found,
    // please return to nearest railway office.
    //                       </pre>
    //                   </div>
    //   `;
  }

}