import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../auth/services/auth'; 
import { Toast } from '../../core/services/toast';

export const superAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const toast = inject(Toast);

  // Verificamos si es SuperAdmin 
  if (authService.isLogged() && authService.isSuperAdmin()) {
    return true; 
  }

  // Si está logueado pero NO es nivel 1, le denegamos acceso
  if (authService.isLogged()) {
    toast.mostrar('Acceso exclusivo para SuperAdministradores', 'error');
    return router.parseUrl('/admin'); 
  }

  // Si no está logueado, al login
  toast.mostrar('Identifícate, por favor.', 'error');
  return router.parseUrl('/login');
};