// src/app/components/applycard/applycard.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-applycard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, DatePipe],
  templateUrl: './applycard.component.html',
  styleUrls: ['./applycard.component.css']
})
export class ApplycardComponent implements OnInit {


  mobile: string = '';
  userData: any = null;
  selectedContract: any = null;
  isDetailView: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  openBurger: boolean = false;
    userName: string = '';

      private crypto = inject(CryptoService);
 

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  this.authService.licenseeId$.subscribe(id => {
    if (id) {
      this.loadUserData(id);

    } else {
      this.errorMessage = 'Licensee ID not found. Please log in again.';
      this.router.navigate(['/login']);
    }
  });

    // Check authentication status
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
  }
loadUserData(licenseeId: string): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.authService.requestData().subscribe({
    next: (data) => {
      //console.log('✅ User data received:', data);

      // Safely check for contract_details
      if (
        data &&
        data.contract_details &&
        Array.isArray(data.contract_details) &&
        data.contract_details.length > 0
      ) {
        const name = data.contract_details[0].Licensee_name;
        //console.log('✅ Extracted Licensee Name:', name);

        this.userName = name;
        this.userData = data;
      } else {
        console.warn('⚠️ No contract details found or in unexpected format:', data);
        this.userName = 'Unknown';
        this.userData = {};
      }

      this.isLoading = false;
    },
    error: (err) => {
      console.error('❌ Failed to fetch data:', err);
      this.errorMessage = 'Failed to load user data. Please try again.';
      this.isLoading = false;
    }
  });
}


  onApply(contract: any): void {
    const token = localStorage.getItem('login_tocken');

    if (token) {
      // Log the contract before saving to check its structure
      //console.log('Contract being saved to localStorage:', contract);

      // Make sure to stringify the complete contract object
      this.crypto.setItem('selectedContract', JSON.stringify(contract));

      // Verify that the data was stored correctly
      const storedData = this.crypto.getItem('selectedContract');
      //console.log('Verification of stored contract:', storedData);
      if (contract.current_count >= contract.contract_details_no_of_employees) {
        alert('Registration limit reached for this contract.');
        return;
      }

      this.router.navigate(['/Register']);
    } else {
      alert('You must be logged in to apply.');
      this.router.navigate(['/login']);
    }
  }

  // View contract details
  onView(contract: any): void {
    //console.log("View button clicked for contract:", contract);
    this.selectedContract = contract;
    this.isDetailView = true;
    this.crypto.setItem('IndividualData', JSON.stringify(contract));
  }
  onBack(): void {
    this.isDetailView = false;
    this.selectedContract = null;
  }

  // Refresh data without navigating away
  refreshData(event: Event): void {
    event.preventDefault(); // Prevent default refresh behavior
    const licenseeId = this.crypto.getItem('licensee_id');
    if (licenseeId) {
      this.loadUserData(licenseeId);
    }

  }

  // Return to contract list view
  backToList(): void {
    this.isDetailView = false;
    this.selectedContract = null;
  }

  // Return to dashboard
  backToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  RejectedCards(): void {
    this.router.navigate(["/Rejected"])
  }

  // Logout
  logout(): void {
    this.router.navigate(['/logout']);
  }

  RenewCard() {
    this.router.navigate(["/renewal"])
  }
  AppliedCard() {
    this.router.navigate(["/applied"])
  }

  Approvedcard() {
    this.router.navigate(["/approvedcard"])
  }

  cancelcard(){
    this.router.navigate(["/cancelled"])
  }
  toggleBurger(): void {
    this.openBurger = !this.openBurger;
  }
}