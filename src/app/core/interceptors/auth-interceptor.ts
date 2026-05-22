import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../../auth//services/auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  // Si el token existe, clonamos la petición y le añadimos el Header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Pasamos la petición clonada con el token
    return next(authReq);
  }

  // Si no hay token, la petición sigue su curso original
  return next(req);
};
