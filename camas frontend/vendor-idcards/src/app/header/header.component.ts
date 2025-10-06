import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../services/crypto.service';

@Component({
  standalone: true,
  selector: 'app-header', 
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userName = 'Guest';
  mobile = '';
  userData: any = null;
  userDataEntries: Array<{label: string, value: any}> = [];
  isLoading = false;
  errorMessage = '';
  showUserDataPopup = false;
  mobileNumb='';

    private crypto = inject(CryptoService);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      
      if (!isAuthenticated) {
        // Only navigate if we're not already on login page
        if (!this.router.url.includes('/login')) {
          this.router.navigate(['/login']);
        }
      } else {
        // Try to get user data when authenticated
        this.checkAndLoadUserData();
      }
    });
    
    // Subscribe to user name changes
    this.authService.mobileNumber$.subscribe(name => {
      this.mobileNumb= name || 'Guest';
    });
    
    // Subscribe to mobile number changes
    this.authService.mobileNumber$.subscribe(number => {
      this.mobile = number;
      
      if (this.isLoggedIn && this.mobile && !this.userData) {
        this.loadUserData();
      }
    });
  }

  checkAndLoadUserData(): void {
    const token = localStorage.getItem('login_tocken');
    const mobile = this.crypto.getItem('mobile_number');
    
    if (token && mobile) {
      this.mobile = mobile;
      this.loadUserData();
    }
  }

  loadUserData(): void {
    if (!this.mobile) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.requestData().subscribe({
      next: (data) => {
        //console.log('User data received:', data);
        this.userData = data;

      this.crypto.setItem('selectedContractDetails', JSON.stringify(this.userData.contract_details[0]));
      // Verify that the data was stored correctly
      const storedData = this.crypto.getItem('selectedContractDetails');
      //console.log('Verification of stored contract:', storedData);
        
        // Set the userName from the userData
        if (data.contract_details && data.contract_details.length > 0) {
          const userName = data.contract_details[0].Licensee_name;
          if (userName) {
            this.userName = userName;
            this.authService.user_name = userName;
          }
        }
        
        // Process userData into entries for display
        this.processUserData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch data', err);
        this.errorMessage = 'Failed to load data. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  toggleUserDataPopup(): void {
    this.showUserDataPopup = !this.showUserDataPopup;
  }
  
  showUserData(): void {
    this.showUserDataPopup = true;
  }
  
  hideUserData(): void {
    this.showUserDataPopup = false;
  }
  
  // Process user data into a formatted array for display
  processUserData(): void {
    if (!this.userData || !this.userData.contract_details || this.userData.contract_details.length === 0) return;
    
    this.userDataEntries = [];
    
    // Map of friendly names for properties
    const labelMap: {[key: string]: string} = {
      'Licensee_name': 'Name',
      'Licensee_firm_name': 'Firm',
      'Licensee_mobile': 'Mobile',
      'Lincensee_division': 'Division',
      'Lincensee_pan': 'PAN',
      'Lincensee_status': 'Status',
      'Lincensee_type': 'Type',
      'Lincensee_zone': 'Zone',
      'contract_code': 'Contract Code',
      'contract_type': 'Contract Type',
      'contract_details_activity': 'Activity',
      'contract_details_award_status': 'Award Status',
      'contract_details_duration': 'Duration',
      'contract_details_start_date': 'Start Date',
      'contract_details_end_date': 'End Date',
      'contract_details_mode_of_operation': 'Mode of Operation',
      'contract_details_no_of_employees': 'Number of Employees',
      'contract_details_pay_mode': 'Payment Mode',
      'contract_station_name': 'Station Name',
      'contract_status': 'Contract Status'
    };
    
    const keysToShow = [
      'Licensee_name', 
      'Licensee_firm_name', 
      // 'Licensee_mobile', 
      // 'contract_code', 
      // 'contract_type', 
      // 'contract_station_name'
    ];
    
    // Loop through selected properties in contract_details[0]
    for (const key of keysToShow) {
      if (this.userData.contract_details[0].hasOwnProperty(key) && 
          this.userData.contract_details[0][key] !== null && 
          this.userData.contract_details[0][key] !== undefined) {
        
        // Use friendly name if available, otherwise format the key
        const label = labelMap[key] || this.formatKeyAsLabel(key);
        
        this.userDataEntries.push({
          label: label,
          value: this.userData.contract_details[0][key]
        });
      }
    }
  }
  
  // Convert camelCase or snake_case keys to Title Case labels
  formatKeyAsLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  applyCard() {
    this.router.navigate(['/applycard']);
  }
  
  backToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    //console.log('Logout clicked');
    
    this.authService.logout().subscribe({
      next: (res) => {
        //console.log('Logged out successfully:', res);
        // No need to call clearAuthData here as it's called in the tap operator in the logout method
      },
      error: (err) => {
        console.error('Logout failed', err);
        // Even on error, we should clear auth data and redirect
        this.authService.clearAuthData();
      }
    });
  }
   menu:boolean=false;

  headerMenu(){
    this.menu=!this.menu
  }
}