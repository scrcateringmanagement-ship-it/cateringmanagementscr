// src/app/services/session-timer.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number; // expiration timestamp
}

@Injectable({
  providedIn: 'root',
})
export class SessionTimerService {
  private countdownSub?: Subscription;
  remainingTime$ = new BehaviorSubject<number>(0); // in seconds

  constructor(private router: Router) { }

  /**
   * Initialize timer from JWT token
   */
  initFromToken(token: string | null) {
    if (!token) {
      this.logout();
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      const expTime = decoded.exp * 1000; // convert to ms
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expTime - now) / 1000));

      if (remaining <= 0) {
        this.logout();
      } else {
        this.startTimer(remaining);
      }
    } catch (e) {
      console.error('Invalid token', e);
      this.logout();
    }
  }

  /**
   * Start countdown timer
   */
  private startTimer(seconds: number) {
    this.stopTimer();
    this.remainingTime$.next(seconds);

    this.countdownSub = interval(1000).subscribe(() => {
      seconds--;
      this.remainingTime$.next(seconds);

      if (seconds <= 0) {
        this.logout();
      }
    });
  }

  /**
   * Logout user
   */
  logout() {
    this.stopTimer();
    alert('Session expired. Please login again.');
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  stopTimer() {
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
    this.remainingTime$.next(0);
  }
}
