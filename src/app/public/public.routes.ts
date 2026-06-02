import { Routes } from '@angular/router';
import { PublicLayout } from '../public/layout/public-layout/public-layout';
import { Home } from './pages/home/home';
import { SobreMi } from './pages/sobre-mi/sobre-mi';
import { loggedGuard } from '../public/guards/logged-guard';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'sobre-mi', component: SobreMi },
      {
        path: 'entradas',
        loadComponent: () => import('./pages/lista-entradas/lista-entradas').then(m => m.ListaEntradas)
      },
      // ⚠️ estáticas antes que :slug
      {
        path: 'entradas/crear',
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/crear-entrada/crear-entrada').then(m => m.CrearEntrada)
      },
      {
        path: 'entradas/editar-entrada/:slug',
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/editar-entrada/editar-entrada').then(m => m.EditarEntrada)
      },
      {
        path: 'entradas/:slug',
        loadComponent: () => import('./pages/detalle-entrada/detalle-entrada').then(m => m.DetalleEntrada)
      },
      {
        path: 'mi-perfil',
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil)
      },
      {
        path: 'mi-perfil/editar',
        canActivate: [loggedGuard],
        loadComponent: () => import('./pages/editar-perfil/editar-perfil').then(m => m.EditarPerfil)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/categorias/categorias').then(m => m.Categorias)
      },
      {
        path: 'categorias/:slug',
        loadComponent: () => import('./pages/detalle-categoria/detalle-categoria').then(m => m.DetalleCategoria)
      }
    ]
  }
];