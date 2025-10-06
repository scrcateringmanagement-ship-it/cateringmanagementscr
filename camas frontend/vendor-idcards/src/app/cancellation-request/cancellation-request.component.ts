import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SafeUrlPipe } from "../safe-url.pipe";
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-cancellation-request',
  imports: [CommonModule, FormsModule],
  providers :[DatePipe] ,
  templateUrl: './cancellation-request.component.html',
  styleUrl: './cancellation-request.component.css'
})
export class CancellationRequestComponent implements OnInit {
closeImageModal() {
this.selectedImage= null;
this.showImageModal = false;
}
  loading: boolean = false;
  error: any | undefined;

  applications: any[] = [];
  filteredApplications: any[] = []
  selectedImage: any;
  showImageModal: boolean=false;
  imageLoadError: boolean=false;

  private crypto = inject(CryptoService)



  constructor(private authService: AuthService , private datePipe: DatePipe) {

  }
  ngOnInit(): void {
    this.loadContractData();
    this.loadApplications()
  }
  filters = {
    licensee_id: 0,
    contract_code: '',
    division: '',
    zone: ''

  }

contract: any = null;

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
      console.log('No contract data found in localStorage');
    }

  }

  loadApplications(): void {
    this.loading = true;
    this.error = null;
    this.authService.getApplicationscancelled(this.filters).subscribe({
      next: (response) => {
        //console.log('Filters after parsing contract:', this.filters);.
        console.log(response);
        this.applications = Array.isArray(response) ? response : response.data || [];
        this.filteredApplications = [...this.applications];
        this.crypto.setItem("all the applicates data", JSON.stringify(this.applications))
        console.log("Applications loaded:", this.applications);
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



   hasFile(fileUrl: string | undefined | null): boolean {
    return !!fileUrl && fileUrl.trim() !== '';
  }

   viewImage(imageUrl: string): void {
    console.log(imageUrl);
    this.selectedImage = imageUrl;
    this.showImageModal = true;
    this.imageLoadError = false;
    //console.log('Opening image:', this.selectedImage);
    //console.log('Original path:', imageUrl);
  }
   

  
   formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || 'N/A';
  }



}










