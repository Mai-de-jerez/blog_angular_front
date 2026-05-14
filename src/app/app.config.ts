// src/app/app.config.ts
import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { Auth } from './core/services/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    // El Router con las rutas
    provideRouter(routes),

    // El cliente HTTP con tus interceptores (token y errores)
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    // El inicializador que arranca Auth antes que nada
    provideAppInitializer(() => {
      const authService = inject(Auth);
      return authService.initAuth(); 
    })
  ]
};

