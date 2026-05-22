// app.routes.ts
import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './pages/public/home/home';
import { SobreMi } from './pages/public/sobre-mi/sobre-mi';
import { loggedGuard } from './core/guards/logged-guard';


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
      { path: 'entradas/:slug',
        loadComponent: () => import('./pages/public/detalle-entrada/detalle-entrada').then(m => m.DetalleEntrada)
       },
       { path: 'entradas/crear', 
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/public/crear-entrada/crear-entrada').then(m => m.CrearEntrada)
      },
      { path: 'entradas/editar-entrada/:slug', 
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/public/editar-entrada/editar-entrada').then(m => m.EditarEntrada)
       },
       {
        path: 'mi-perfil',
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/public/mi-perfil/mi-perfil').then(m => m.MiPerfil)
       },
       {
        path: 'mi-perfil/editar',
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/public/editar-perfil/editar-perfil').then(m => m.EditarPerfil)
       }
    ]
  },

  {
  path: '',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  { path: '**', redirectTo: '' } 
];
