import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtenemos el token del sessionStorage 
  const token = sessionStorage.getItem('token');

  // 2. Si el token existe, clonamos la petición y le añadimos el Header
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
