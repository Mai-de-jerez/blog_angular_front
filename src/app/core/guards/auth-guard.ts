import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth'; // Asegúrate de que la ruta sea correcta

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Comprobamos el Signal que creamos antes
  if (authService.isLogged()) {
    return true; // Adelante, puedes pasar
  }

  // Si no está logueado, patada y al login
  console.warn('Acceso denegado por el Guard: Redirigiendo...');
  router.navigate(['/login']);
  return false;
};
