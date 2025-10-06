// src/app/services/token.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload { exp: number; }

@Injectable({ providedIn: 'root' })
export class TokenService {
  constructor(private router: Router) {}

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      return Date.now() < decoded.exp * 1000;
    } catch (e) {
      return false;
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
