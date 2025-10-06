
import { ApplicationConfig } from '@angular/core';
import { provideRouter,withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { maintenanceInterceptor } from './maintenance.interceptor';
// import { provideAnimations } from '@angular/platform-browser/animations';provideAnimations()

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withHashLocation()),
      provideHttpClient(
      withInterceptors([maintenanceInterceptor])
    ),
     provideAnimations() 

   ]
};
