// // src/app/interceptors/maintenance.interceptor.ts
// import { inject } from '@angular/core';
// import {
//   HttpInterceptorFn,
//   HttpRequest,
//   HttpHandlerFn,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { catchError, throwError } from 'rxjs';

// export const maintenanceInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
//   const router = inject(Router);

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 503) {
//         alert('Site is under maintenance. Please try again later.');
//         router.navigate(['/login']);
//       }
//       return throwError(() => error);
//     })
//   );
// };
/////////-------------------
// src/app/interceptors/maintenance.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const maintenanceInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 503) {
        alert('Site is under maintenance. Please try again later.');
        router.navigate(['/login']);
      } 
      else if (error.status === 401 || error.status === 403) {
        // Token expired or unauthorized
        alert('Invalid Credentials. Please log in again.');
        // Clear local/session storage if you save token
        sessionStorage.clear();
        localStorage.clear();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};

