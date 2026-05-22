// src/app/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Login } from './pages/login/login';
import { SolicitarPassword } from './pages/solicitar-password/solicitar-password';
import { CambiarPassword } from './pages/cambiar-password/cambiar-password';
import { Registro } from './pages/registro/registro';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'solicitar-recuperacion', component: SolicitarPassword },
      { path: 'cambiar-password', component: CambiarPassword },
      { path: 'registro', component: Registro }
    ]
  }
];