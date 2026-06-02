import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from '../services/toast';

const ERRORES: Record<string, string> = {
  // Autenticación y registro
  // --- AUTENTICACIÓN ---
  CREDENCIALES_INCORRECTAS: 'Usuario o contraseña incorrectos',

  // --- USUARIO ---
  USERNAME_REQUERIDO: 'El nombre de usuario es obligatorio',
  PASSWORD_REQUERIDA: 'La contraseña es obligatoria',
  PASSWORD_DEBIL: 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número',
  PASSWORD_NO_COINCIDEN: 'Las contraseñas no coinciden',
  NOMBRE_REQUERIDO: 'El nombre es obligatorio',
  APELLIDOS_REQUERIDOS: 'Los apellidos son obligatorios',
  EMAIL_REQUERIDO: 'El email es obligatorio',
  EMAIL_INVALIDO: 'El email no es válido',
  EMAIL_NO_REGISTRADO: 'No existe ninguna cuenta con ese email',
  ROL_REQUERIDO: 'El rol es obligatorio',
  TELEFONO_INVALIDO: 'El teléfono debe tener 9 dígitos',
  EMAIL_DUPLICADO: 'Ya existe una cuenta con ese email',
  USERNAME_DUPLICADO: 'Ese nombre de usuario ya está en uso',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',

  // --- ENTRADAS ---
  ENTRADA_NO_ENCONTRADA: 'La entrada que buscas no existe',
  SLUG_NO_ENCONTRADO: 'La entrada que buscas no existe',
  AUTOR_NO_EXISTE: 'El autor especificado no existe',
  CATEGORIA_REQUERIDA: 'Debes seleccionar una categoría',
  CATEGORIA_NO_EXISTE: 'La categoría seleccionada no existe',
  CATEGORIA_NUEVA_NO_EXISTE: 'La nueva categoría seleccionada no existe',

  // --- COMENTARIOS ---
  COMENTARIO_NO_ENCONTRADO: 'El comentario no existe',
  TEXTO_VACIO: 'El comentario no puede estar vacío',
  TEXTO_DEMASIADO_CORTO: 'El comentario es demasiado corto (mínimo 3 caracteres)',
  TEXTO_DEMASIADO_LARGO: 'El comentario no puede superar los 1000 caracteres',
  COMENTARIO_PADRE_ENTRADA_DISTINTA: 'El comentario al que intentas responder no pertenece a esta entrada',

  // --- CATEGORÍAS ---
  CATEGORIA_NO_ENCONTRADA: 'La categoría no existe',
  CATEGORIA_YA_EXISTE: 'Ya existe una categoría con ese nombre',
  NOMBRE_DEMASIADO_CORTO: 'El nombre es demasiado corto (mínimo 3 caracteres)',
  NOMBRE_DEMASIADO_LARGO: 'El nombre no puede superar los 50 caracteres',
  CARACTER_NO_PERMITIDO: 'El nombre contiene caracteres no permitidos',
  CATEGORIA_NO_PUEDE_SER_PADRE_DE_SI_MISMA: 'Una categoría no puede ser su propio padre',

  // --- IMÁGENES ---
  IMAGEN_SIN_EXTENSION: 'El archivo no tiene extensión',
  IMAGEN_EXTENSION_NO_PERMITIDA: 'Solo se permiten imágenes JPG, PNG o WEBP',
  IMAGEN_DEMASIADO_GRANDE: 'La imagen no puede superar los 5 MB',
  IMAGEN_CORRUPTA: 'El archivo de imagen está corrupto o no es válido',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(Toast);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 1. Sin conexión o servidor inaccesible
      if (error.status === 0) {
        toast.mostrar('Sin conexión. Comprueba tu red o inténtalo más tarde', 'error');
        return throwError(() => error);
      }

      // 2. Errores de servidor (500, 503...)
      if (error.status >= 500) {
        toast.mostrar('Error en el servidor. Inténtalo más tarde', 'error');
        return throwError(() => error);
      }

      // 3. No autorizado → redirige al login sin toast o con mensaje específico
      if (error.status === 401) {
        const codigo = error.error?.codigo;
        if (codigo === 'CREDENCIALES_INCORRECTAS') {
          toast.mostrar(ERRORES['CREDENCIALES_INCORRECTAS'], 'error');
        } else {
          sessionStorage.clear();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      }

      // 4. Prohibido → logado pero sin permiso
      if (error.status === 403) {
        toast.mostrar('No tienes permiso para realizar esta acción', 'error');
        return throwError(() => error);
      }

      // 5. Errores de negocio (400, 404...) con codigo del backend
      const codigoError = error.error?.codigo;
      const campo = error.error?.campo;

      const mensajeBase = ERRORES[codigoError]
                       ?? error.error?.mensaje
                       ?? 'Ocurrió un error inesperado';

      const mensajeFinal = campo ? `${mensajeBase} (${campo})` : mensajeBase;
      toast.mostrar(mensajeFinal, 'error');

      return throwError(() => error);
    })
  );
};


