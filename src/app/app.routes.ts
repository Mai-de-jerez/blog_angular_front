// app.routes.ts
import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './pages/public/home/home';
import { Login } from './pages/public/login/login';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { SobreMi } from './pages/public/sobre-mi/sobre-mi';
import { authGuard } from './core/guards/auth-guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { loggedGuard } from './core/guards/logged-guard';
import { SolicitarPassword } from './pages/public/solicitar-password/solicitar-password';
import { CambiarPassword } from './pages/public/cambiar-password/cambiar-password';


export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'sobre-mi', component: SobreMi },
      { path: 'entradas', 
        loadComponent: () => import('./pages/public/lista-entradas/lista-entradas').then(m => m.ListaEntradas)
       },
      { path: 'entradas/crear', 
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/public/crear-entrada/crear-entrada').then(m => m.CrearEntrada)
      },
      { path: 'entradas/:slug',
        loadComponent: () => import('./pages/public/detalle-entrada/detalle-entrada').then(m => m.DetalleEntrada)
       },
      { path: 'entradas/editar-entrada/:slug', 
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/public/editar-entrada/editar-entrada').then(m => m.EditarEntrada)
       }
    ]
  },

  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'solicitar-recuperacion', component: SolicitarPassword },
      { path: 'cambiar-password', component: CambiarPassword }
    ]
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard], 
    children: [      
      { path: '', 
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard)
     },
    ]
  },

  { path: '**', redirectTo: '' } 
];
