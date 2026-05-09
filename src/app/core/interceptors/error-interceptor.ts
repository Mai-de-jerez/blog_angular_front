import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from '../services/toast';

const ERRORES: Record<string, string> = {
  CREDENCIALES_INCORRECTAS: 'Usuario o contraseña incorrectos',
  PASSWORD_DEBIL: 'La contraseña es demasiado débil',
  USERNAME_REQUERIDO: 'El nombre de usuario es obligatorio',
  PASSWORD_REQUERIDA: 'La contraseña es obligatoria',
  PASSWORD_NO_COINCIDEN: 'Las contraseñas no coinciden',
  EMAIL_REQUERIDO: 'El email es obligatorio',
  EMAIL_INVALIDO: 'El email no es válido',
  EMAIL_NO_REGISTRADO: 'No existe ninguna cuenta con ese email',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
  NOMBRE_REQUERIDO: 'El nombre es obligatorio',
  APELLIDOS_REQUERIDOS: 'Los apellidos son obligatorios',
  ROL_REQUERIDO: 'El rol es obligatorio',
  TELEFONO_INVALIDO: 'El teléfono debe tener 9 dígitos',
  EMAIL_DUPLICADO: 'Ya existe una cuenta con ese email',
  USERNAME_DUPLICADO: 'Ese nombre de usuario ya está en uso'
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





