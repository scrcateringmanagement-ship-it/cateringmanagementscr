import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logout-container">
      <p>{{ logoutMessage }}</p>
    </div>
  `,
  styles: [`
    .logout-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 1.2rem;
    }
  `]
})
export class LogoutComponent implements OnInit {
  logoutMessage = 'Logging out...';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //console.log('LogoutComponent initialized');
    
    // Perform logout API call
    this.authService.logout().subscribe({
      next: (response: any) => {
        //console.log('Logout successful:', response);
        this.logoutMessage = 'Logout successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error: any) => {
        console.error('Logout error:', error);
        this.logoutMessage = 'Logout failed! Redirecting to login...';
        
        // Even if API fails, clear local data and redirect
        setTimeout(() => {
          this.authService.clearAuthData();
        }, 1000);
      }
    });
  }
}