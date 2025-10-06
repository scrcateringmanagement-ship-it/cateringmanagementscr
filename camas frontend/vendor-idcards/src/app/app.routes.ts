// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

// Routes will be lazy-loaded for better performance
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./otp-verification/otp-verification.component')
      .then(m => m.OtpVerificationComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'applycard',
    canActivate: [authGuard],
    loadComponent: () => import('./applycard/applycard.component')
      .then(m => m.ApplycardComponent)
  },
  {
    path: 'logout',
    loadComponent: () => import('./logout/logout.component')
      .then(m => m.LogoutComponent)
  } ,
  {
   path:'Register',
   canActivate: [authGuard],
   loadComponent:()=>import('./registrationforidcards/registrationforidcards.component')
    .then(m=>m.RegistrationComponent)
  },
  {
    path: 'applied',
    canActivate: [authGuard],
    loadComponent: () => import('./applied-cards/applied-cards.component')
      .then(m => m.AppliedCardsComponent)
  },
  {
    path: 'renewal',
    canActivate: [authGuard],
    loadComponent: () => import('./renewal-card/renewal-card.component')
      .then(m => m.RenewalCardComponent)
  },
  {                                                   //ApprovedcardsComponent
    path: 'cancellation',
    canActivate: [authGuard],
    loadComponent: () => import('./cancellation-request/cancellation-request.component')
      .then(m => m.CancellationRequestComponent)
  },
   {                                                   //ApprovedcardsComponent
    path: 'approvedcard',
    canActivate: [authGuard],
    loadComponent: () => import('./approvedcards/approvedcards.component')
      .then(m => m.ApprovedcardsComponent)
  },
  {
    path: 'Rejected',
    canActivate: [authGuard],
    loadComponent: () => import('./rejected/rejected.component')
      .then(m => m.RejectedComponent )
  },

  {
    path: 'cancelled',
    canActivate: [authGuard],
    loadComponent: () => import('./cancellation-request/cancellation-request.component')
      .then(m => m.CancellationRequestComponent  )
  },




  {
    path: '**',
    redirectTo: '/login'
  }
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes, { useHash: true })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

