import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { adminGuard } from '../admin/guards/admin-guard';
import { superAdminGuard } from '../admin/guards/super-admin-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/lista-usuarios/lista-usuarios').then(m => m.ListaUsuarios)
      },
      {
        path: 'usuarios/crear',
        canActivate: [superAdminGuard],
        loadComponent: () => import('./pages/crear-usuario/crear-usuario').then(m => m.CrearUsuario)
      },
      {
        path: 'usuarios/detalle/:id',
        loadComponent: () => import('./pages/detalle-usuario/detalle-usuario').then(m => m.DetalleUsuario)
      },
      {
        path: 'usuarios/editar/:id',
        canActivate: [superAdminGuard],
        loadComponent: () => import('./pages/editar-usuario/editar-usuario').then(m => m.EditarUsuario)
      },
      {
        path: 'entradas',
        loadComponent: () => import('./pages/lista-entradas-admin/lista-entradas-admin').then(m => m.ListaEntradasAdmin)
      },
      {
        path: 'entradas/crear',
        loadComponent: () => import('./pages/crear-entrada/crear-entrada').then(m => m.CrearEntrada)
      },
      {
        path: 'entradas/editar/:id',
        loadComponent: () => import('./pages/editar-entrada/editar-entrada').then(m => m.EditarEntrada)
      },
      {
        path: 'entradas/detalle/:id',
        loadComponent: () => import('./pages/detalle-entrada/detalle-entrada').then(m => m.DetalleEntrada)
      },
      {
        path: 'categorias', 
        loadComponent: () => import('./pages/lista-categorias-admin/lista-categorias-admin').then(m => m.ListaCategoriasAdmin)
      },
      {
        path: 'categorias/crear',
        loadComponent: () => import('./pages/crear-categoria/crear-categoria').then(m => m.CrearCategoria)
      },
      {
        path: 'categorias/editar/:id',
        loadComponent: () => import('./pages/editar-categoria/editar-categoria').then(m => m.EditarCategoria)
      }, 
      {
        path: 'comentarios',
        loadComponent: () => import('./pages/listar-comentarios/listar-comentarios').then(m => m.ListarComentarios)
      },
      {
        path: 'comentarios/detalle/:id',
        loadComponent: () => import('./pages/detalle-comentario/detalle-comentario').then(m => m.DetalleComentario)
      }
    ]
  }
];