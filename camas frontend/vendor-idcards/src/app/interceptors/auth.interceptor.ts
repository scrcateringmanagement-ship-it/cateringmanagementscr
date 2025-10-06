// auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Attach token if exists
  const token = localStorage.getItem('login_tocken');
  if (token && !request.headers.has('Authorization')) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.clearAuthData();
        router.navigate(['/login']);
      } else if (error.status === 503) {

        alert("Site is Under Maintenance")
        authService.clearAuthData();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
