import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SafeUrlPipe } from '../safe-url.pipe';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-applied-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './applied-cards.component.html',
  styleUrl: './applied-cards.component.css'
})
export class AppliedCardsComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  loading = false;
  error: string | null = null;
  selectedImage: string | null = null;
  showImageModal = false;
  contract: any = null;
  imageLoadError = false;
  status: string | undefined;
  bgColor: string | undefined;
  // userstatus:boolean =false ;

  // Search functionality
  searchTerm = '';

  private crypto = inject(CryptoService);



  filters = {
    zone: '',
    division: '',
    licensee_id: 0,
    contract_code: ''
  };

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadContractData();
    this.loadApplications();
  }

  loadContractData(): void {
    const storedContract = this.crypto.getItem('IndividualData');
    //console.log("applied cards component load contract data", storedContract)

    if (storedContract) {
      try {
        this.contract = JSON.parse(storedContract);
        //console.log('Parsed contract data:', this.contract);
        this.filters.licensee_id = this.contract.licensee_id;
        this.filters.contract_code = this.contract.contract_code || '';
        this.filters.division = this.contract.Lincensee_division || '';
        this.filters.zone = this.contract.Lincensee_zone || '';
      } catch (error) {
        console.error('Error parsing stored contract:', error);
      }
    } else {
      //console.log('No contract data found in localStorage');
    }
  }

  loadApplications(): void {
    this.loading = true;
    this.error = null;
    this.authService.getApplications(this.filters).subscribe({
      next: (response) => {
        //console.log('Filters after parsing contract:', this.filters);
        this.applications = Array.isArray(response) ? response : response.data || [];
        this.filteredApplications = [...this.applications];
        this.crypto.setItem("all the applicates data", JSON.stringify(this.applications))
        //console.log("Applications loaded:", this.applications);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching applications:', err);
        //console.log('Filters after parsing contract else:', this.filters);
        this.error = 'Failed to load applications. Please try again.';
        this.loading = false;

      }
    });
  }
  getBgColor(status: string): string {
    switch (status) {
      case 'RA': return '#fff59d'; // yellow for Reapplied
      case 'R': return '#ef9a9a';  // red for Rejected
      case 'A': return '#a5d6a7';  // green for Approved
      default: return '#e3f2fd';   // blue for Pending/others
    }
  }

  getStatus(status: string) {
    switch (status) {
      case '1':
        return 'uv office admin'
      case '2':
        return 'uv approver'
      case 'RA':
        return 'Reapplied'
      case 'R':
        return 'Rejected'
      case 'A':
        return 'Approved'
      default:
        return 'uv cci'
    }
  }

  // Search functionality
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredApplications = [...this.applications];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredApplications = this.applications.filter(app =>
      // Search in name (first, middle, last)
      (app.first_name?.toLowerCase().includes(searchLower)) ||
      (app.middle_initial?.toLowerCase().includes(searchLower)) ||
      (app.last_name?.toLowerCase().includes(searchLower)) ||
      (app.name?.toLowerCase().includes(searchLower)) ||

      // Search in Aadhar number
      (app.aadhar_number?.toString().includes(searchLower)) ||

      // Search in email
      (app.email?.toLowerCase().includes(searchLower)) ||

      // Search in address
      (app.address?.toLowerCase().includes(searchLower)) ||

      // Search in designation
      (app.designation?.toLowerCase().includes(searchLower)) ||

      // Search in remarks
      (app.licensee_remarks?.toLowerCase().includes(searchLower)) ||

      // Search in phone number
      (app.phone_number?.toString().includes(searchLower)) ||

      // Search in license name
      (app.license_name?.toLowerCase().includes(searchLower)) ||

      // Search in location
      (app.location?.toLowerCase().includes(searchLower))
    );
  }

  // Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredApplications = [...this.applications];
  }

  // Helper method to get full image URL - SIMPLIFIED FOR LOCAL STORAGE
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }


    return imagePath;
  }


  // Open image in modal with full URL
  viewImage(url: string): void {
    this.selectedImage = this.getFullImageUrl(url);
    this.showImageModal = true;
    this.imageLoadError = false;
    //console.log('Opening image:', this.selectedImage);
    //console.log('Original path:', url);
  }

  // Close image modal
  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImage = null;
    this.imageLoadError = false;
  }

  // Handle image load errors with debugging
  onImageError(event: any): void {
    console.error('Failed to load image:', this.selectedImage);
    console.error('Image error event:', event);

    // Log the constructed URL for debugging
    const img = event.target as HTMLImageElement;
    console.error('Failed URL from img element:', img.src);

    this.imageLoadError = true;
  }

  // Function to format date for display
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
  }

  // Apply filters (keeping this for backward compatibility)
  applyFilters(): void {
    this.loadApplications();
  }

  // Check if file exists/is valid - Fixed return type
  hasValidFile(filePath: string): boolean {
    return !!(filePath && filePath.trim() !== '' && filePath !== 'null');
  }

  // Debug method to test URL accessibility
  testImageUrl(imagePath: string): void {
    const url = this.getFullImageUrl(imagePath);
    //console.log('Testing URL:', url);

    // Create a test image element
    const testImg = new Image();
    testImg.onload = () => //console.log(' Image loaded successfully:', url);
      testImg.onerror = () => {
        //console.log(' Image failed to load:', url);
      };
    testImg.src = url;
  }
}