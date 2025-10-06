// src/app/components/dashboard/dashboard.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  showPopup = false;
  mobileNumber: string = '';
  userName: string = 'User';
  isLoading: boolean = false;
  userData: any = {};  // Store the user data here


  
  
 

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  


  ngOnInit(): void {
 this.authService.licenseeId$.subscribe(id => {
    //console.log('Licensee ID:', id);
    if (id) this.getUserData(id);
  });

    
    // Check authentication status
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
  }

 getUserData(licenseeId: string): void {
  this.isLoading = true;
  this.authService.requestData().subscribe({
    next: (data) => {
      if (data && data.name) {
        this.userName = data.name;
      }
      this.userData = data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Failed to fetch user data', err);
      this.isLoading = false;
    }
  });
}


  // Handle navigation from select dropdown
  onSelectPage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const path = selectElement.value;
    if (path) {
      this.router.navigate([path]);
    }
  }

  // Navigate to apply card page
  applyCard(): void {
    this.router.navigate(['/applycard']);
  }

  // Logout
  logout(): void {
    this.router.navigate(['/logout']);
  }
}