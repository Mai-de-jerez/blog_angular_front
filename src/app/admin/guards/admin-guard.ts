import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../auth/services/auth'; 
import { Toast } from '../../core/services/toast';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const toast = inject(Toast);

  // Si es admin padentro
  if (authService.isLogged() && authService.isAdmin()) {
    return true; 
  }

  // si stá logueado pero no es admin a la home
  if (authService.isLogged()) {
    toast.mostrar('No tienes permisos de administrador', 'error');
    return router.parseUrl('/'); 
  }

  // si no está ni logueado al login a loguarse
  toast.mostrar('Identifícate, por favor.', 'error');
  return router.parseUrl('/login');
};

