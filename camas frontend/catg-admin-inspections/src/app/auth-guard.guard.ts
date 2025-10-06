

// src/app/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { ApicallService } from './apicall.service';

interface JwtPayload {
  exp: number;
  // Optionally include 'sub', 'iat', etc.
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isTokenValidated = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private apicall: ApicallService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    // Step 1: Decode JWT and check expiry
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const isExpired = Date.now() >= decoded.exp * 1000;
      if (isExpired) {
        console.warn('JWT expired');
        this.router.navigate(['/login']);
        return of(false);
      }
    } catch (e) {
      console.error('Invalid JWT structure');
      this.router.navigate(['/login']);
      return of(false);
    }

    // Step 2: If already validated, skip backend call
    if (this.isTokenValidated) {
      return of(true);
    }

    // Step 3: Call backend to validate token once per session
    return this.http.post<{ valid: boolean }>(
      this.apicall.apiUrl + 'validate-token',
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    ).pipe(
      map(res => {
        if (res.valid) {
          this.isTokenValidated = true;
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(err => {
        if (err.status === 503) {
          alert('Site is under maintenance. Please try again later.');
        }
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}

