// src/app/components/otp-verification/otp-verification.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  phoneForm: FormGroup;
  otpForm: FormGroup;
  otpSent = false;
  errorMessage = '';
  remainingTime = 120;
  timerSubscription: Subscription | null = null;
  otpExpired = false;
  isLoggedIn = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });
  }

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      if (this.isLoggedIn) {
        this.router.navigate(['/applycard']);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.error?.message || 'An error occurred';
    return throwError(() => new Error(errorMsg));
  }

  // Request OTP
  requestOtp(otpparam: any): void {
    var otpdata;

    if (this.phoneForm.valid) {
      this.isLoading = true;
      const phoneNumber = this.phoneForm.get('phoneNumber')?.value;

      if (otpparam === "1") {
        otpdata = { "mobile": phoneNumber, "resend": "r" }
      } else {
        otpdata = { "mobile": phoneNumber }
      }

      this.authService.requestOtp(otpdata)

        .pipe(

          catchError(error => this.handleError(error))

        )
        .subscribe({
          next: (response) => {
            //console.log('✅ OTP request successful:', response);
            const message = response.message
            this.otpSent = true;
            this.errorMessage = '';
            this.startTimer();
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = error.message || 'Invalid number entered';
            this.isLoading = false;
          }
        });
    }
  }

  // Start 30-second timer
  startTimer(): void {
    this.remainingTime = 120;
    this.otpExpired = false;

    // Clear previous subscription if exists
    this.stopTimer();

    this.timerSubscription = interval(1000).pipe(
      take(121) // 0 to 30 seconds
    ).subscribe({
      next: (count) => {
        this.remainingTime = 120 - count;
        if (this.remainingTime <= 0) {
          this.otpExpired = true;


          this.stopTimer();
        }
      }
    });
  }



  // Stop timer
  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  // Verify OTP
  verifyOtp(): void {
    if (this.otpForm.valid && !this.otpExpired) {
      this.isLoading = true;
      const phoneNumber = this.phoneForm.get('phoneNumber')?.value;
      const otp = this.otpForm.get('otp')?.value;

      this.authService.verifyOtp(phoneNumber, otp)
        .pipe(
          catchError(error => this.handleError(error))

        )
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response && response.access_token) {
              this.stopTimer();
              this.router.navigate(['/applycard']);
            }
          },
          error: (error) => {
            this.errorMessage = error.message || 'Invalid OTP';
            this.isLoading = false;
          }
        });
    } else if (this.otpExpired) {
      this.errorMessage = 'OTP has expired. Please request a new one.';
    }
  }

  // Resend OTP
  resendOtp(): void {
    this.requestOtp("1");
  }
}
