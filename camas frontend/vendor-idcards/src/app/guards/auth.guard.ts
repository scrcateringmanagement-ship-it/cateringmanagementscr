// src/app/guards/auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { take, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
// Additional guard to prevent authenticated users from accessing login page
export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuth => {
      if (isAuth) {
        router.navigate(['/applycard']);
        return false;
      }
      return true;
    })
  );
};