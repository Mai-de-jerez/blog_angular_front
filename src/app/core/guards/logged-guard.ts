import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../auth/services/auth';

export const loggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Aquí solo nos importa que esté logueado (da igual si es rol 1, 2 o 3)
  if (authService.isLogged()) {
    return true; 
  }

  // Si no está logueado, al login
  router.navigate(['/login']);
  return false;
};
