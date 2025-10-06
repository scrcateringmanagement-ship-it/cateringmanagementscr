// src/app/services/auth.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private apiUrl = 'http://10.196.22.101:8001/api';
 //  private apiUrl = 'https://cateringmanagement.indianrailways.gov.in/api';

   private crypto = inject(CryptoService);



   




  


  // Using BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Store mobile number in both service and localStorage
  private _mobileNumber = new BehaviorSubject<string>(this.crypto.getItem('mobile_number') || '');
  public mobileNumber$ = this._mobileNumber.asObservable();

  private _licenseeId = new BehaviorSubject<string>(this.crypto.getItem('licensee_id') || '');
  public licenseeId$ = this._licenseeId.asObservable();


  // Store user name as BehaviorSubject for real-time updates
  private _userName = new BehaviorSubject<string>(this.crypto.getItem('user_name') || 'Guest');
  public userName$ = this._userName.asObservable();

  private isTokenValid(): boolean {
    const token = localStorage.getItem('login_tocken');

    if (!token) {
      return false;
    }

    try {
      // Decode JWT token (assumes it's a JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // Check if token has expired
      if (payload.exp && payload.exp < currentTime) {
        this.clearAuthData()
        // Token has expired, remove it
        // localStorage.removeItem('login_tocken');
        return false;
      }

      return true;
    } catch (error) {
      // Invalid token format, remove it
      console.error('Invalid token format:', error);
      this.clearAuthData()
      // localStorage.removeItem('login_tocken');
      return false;
    }
  }

  private watchTokenChanges() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'login_tocken') {
        const tokenValid = this.isTokenValid();
        this.isAuthenticatedSubject.next(tokenValid);
        if (!tokenValid) {
          this.router.navigate(['/login']);
        }
      }
    });

    // Check every 3 seconds in current tab for token validity
    setInterval(() => {
      const tokenValid = this.isTokenValid();
      const currentAuthState = this.isAuthenticatedSubject.value;

      if (!tokenValid && currentAuthState) {
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
      }
    }, 3000);
  }
  private getTokenRemainingTime(): number {
    const token = localStorage.getItem('login_tocken');

    if (!token) {
      return 0;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp) {
        return Math.max(0, payload.exp - currentTime);
      }

      return 0;
    } catch (error) {
      return 0;
    }
  }

  constructor(private http: HttpClient, private router: Router) {
    // Initialize auth state on service creation
    this.isAuthenticatedSubject.next(this.hasToken());

    this.watchTokenChanges();
  }

  // Get headers with auth token
  private getHeaderOptions() {
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('login_tocken')}`)
        .set('Content-Type', 'application/json')
    };
  }
  // private getfileheadersoptions() {
  //   return {
  //     headers: new HttpHeaders({
  //       'X-Test-Header': '123'
  //     })
  //   }
  // }

  private getFileHeaderOptionsfile() {
    const token = localStorage.getItem('login_tocken'); // ensure key is correct
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'X-Test-Header': '123'
      })
    };
  }


  // Get file upload headers (without Content-Type)
  private getFileHeaderOptions() {
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('login_tocken')}`)
    };
  }

  // Headers with application/x-www-form-urlencoded
  getHeaderOptionsdata() {
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('login_tocken')}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
    };
  }

  // Headers with just application/json
  headeroptionsjson() {
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('login_tocken')}`)
        .set('Content-Type', 'application/json')
    };
  }

  // Get rejected card applications
  getRejectedCards(filter: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rejectcards`, filter, this.getHeaderOptions());
  }

  // Get renewal card applications
  getRenewalCards(filter: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/renewalcards`, filter, this.getHeaderOptions());
  }

  // Update an application (including file uploads)
  updateApplication(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/formapplicationupdate`, formData, this.getFileHeaderOptions());
  }
  
  // Renew an application (including file uploads)
  renewApplication(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/formapplicationrenew`, formData, this.getFileHeaderOptions());
  }

  // Get all applications based on filters
  getApplications(filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formapplicationget`, filters, this.getHeaderOptions());
  }

    // Get all applications based on filters
  getApplicationscancelled(filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formapplicationgetcancelled`, filters, this.getHeaderOptions());
  }

  Approvecards(filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approvecardslic`, filters, this.getHeaderOptions());
  }

  RejectedCards(filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rejectcards`, filters, this.getHeaderOptions());
  }

  UpdateCard(filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formapplicationupdate`, filters, this.getHeaderOptions());
  }

  // Submit application form data with file URLs
  insertContractTextDetails(formData: any): Observable<any> {
    //console.log('Submitting complete form data with file URLs:', formData);
    return this.http.post(`${this.apiUrl}/formapplicationinsert`, formData, this.getHeaderOptions());
  }

  getvendorposition(): Observable<any> {
    return this.http.post(`${this.apiUrl}/getvendorposition`, {}, this.getHeaderOptions())
  }

  // Check if token exists
  private hasToken(): boolean {
    return !!localStorage.getItem('login_tocken');
  }

  // Get mobile number
  get mobile_number(): string {
    return this._mobileNumber.value;
  }

  // Set mobile number
  set mobile_number(value: string) {
    this._mobileNumber.next(value);
    this.crypto.setItem('mobile_number', value);
  }

  // Get user name
  get user_name(): string {
    return this._userName.value;
  }

  // Set user name
  set user_name(value: string) {
    this._userName.next(value);
    this.crypto.setItem('user_name', value);
  }

  // Request OTP for a phone number
  requestOtp(otpdata: any): Observable<any> {
    this.mobile_number = otpdata.mobile;
    //console.log("    this.mobile_number ", this.mobile_number)
    return this.http.post<any>(`${this.apiUrl}/sendotp`, otpdata);
  }

  // Verify OTP
  verifyOtp(phoneNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verifyOtp`, {
      mobile: phoneNumber,
      otp: otp
    }).pipe(
      tap(response => {
        if (response && response.access_token) {
          //console.log('respose', response)
          // Store auth data
          localStorage.setItem('login_tocken', response.access_token);
          this.crypto.setItem('mobile_number', phoneNumber);
          this.crypto.setItem('licensee_id', response.licenseeID.toString());
          this.crypto.setItem('managermobile' , response.Managermobile)

          this._licenseeId.next(response.licenseeID.toString()); // update BehaviorSubject
          if (response.user_name) {
            this.crypto.setItem('user_name', response.user_name);
            this.user_name = response.user_name;
          }

          this.mobile_number = phoneNumber;
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  requestData(): Observable<any> {
    const licenseeId = this.crypto.getItem('licensee_id') || '';
    const mobileNumber = this.crypto.getItem('mobile_number') || '';
  
    //console.log('logdataaaa', licenseeId)

    return this.http.post<any>(
      `${this.apiUrl}/liccontractDetails`,
      { licensee_id: licenseeId , managermobile:mobileNumber },
      this.getHeaderOptions()
    ).pipe(
      tap(response => {
        if (response && response.contract_details && response.contract_details.length > 0) {
          const userName = response.contract_details[0].Licensee_name;
          if (userName) {
            this.crypto.setItem('user_name', userName);
            this.user_name = userName;
          }
        }
      })
    );
  }


  // Logout - fixed to ensure proper URL and token
  logout(): Observable<any> {
    const logoutUrl = `${this.apiUrl}/logout`;
    //console.log('Logout URL:', logoutUrl);

    return this.http.post(logoutUrl, {}, this.getHeaderOptions())
      .pipe(
        tap(() => {
          this.clearAuthData();
        })
      );
  }

  getUserName(): string {
    return this._userName.value;
  }

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem('login_tocken');
    localStorage.removeItem('mobile_number');
    localStorage.removeItem('user_name');
    this._mobileNumber.next('');
    this._userName.next('Guest');
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // deleteFile(fileUrl: string): Observable<any> {

  //   const payload = {
  //     fileurl: fileUrl  
  //   };

  //   return this.http.post(
  //     `${this.apiUrl}/formapplicationfileinsert`,
  //     payload,
  //     this.getHeaderOptions()
  //   );
  // }

  deleteFile(fileUrl: string): Observable<any> {
    const body = {
      fileurl: fileUrl
    };

    return this.http.post(
      `${this.apiUrl}/formapplicationfileinsert`,
      body,
      this.getHeaderOptions()
    );
  }

  printedIdSave(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/formapplicationprint`, { id }, this.getFileHeaderOptions());
  }
  // cancel(id: number): Observable<any> {

  //   return this.http.post(`${this.apiUrl}/formapplicationcancel`, { id }, this.getFileHeaderOptions());
  // }

  cancel(data: { id: number, remarks: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/formapplicationcancel`, data, this.getFileHeaderOptions());
  }




  uploadFilePhoto(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/uploadFileIdCard`, payload, { ...this.getFileHeaderOptionsfile() });
  }

  validate_Aadhar(adhardata: any) {
    return this.http.post(`${this.apiUrl}/validate_aadhar` , adhardata , this.getHeaderOptions());
  }



}