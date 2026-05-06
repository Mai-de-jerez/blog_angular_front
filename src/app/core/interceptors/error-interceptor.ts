import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from '../services/toast';

const ERRORES: Record<string, string> = {
  CREDENCIALES_INCORRECTAS: 'Usuario o contraseña incorrectos',
  PASSWORD_DEBIL: 'La contraseña es demasiado débil',
  USERNAME_REQUERIDO: 'El nombre de usuario es obligatorio',
  PASSWORD_REQUERIDA: 'La contraseña es obligatoria'
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(Toast);

  return next(req).pipe(
    catchError((error) => {
      // 1. Manejo de sesiones (401/403)
      if ([401, 403].includes(error.status)) {
        sessionStorage.clear();
        router.navigate(['/login']);
      }
      
      // 2. Mostrar errores específicos del backend
      const codigoError = error.error?.codigo;
      const mensaje = ERRORES[codigoError] || 'Ocurrió un error inesperado';
      toast.mostrar(mensaje);
      
      return throwError(() => error);
    })
  );
};





