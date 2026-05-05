// app.routes.ts
import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './pages/public/home/home';
import { ListaEntradas } from './pages/public/lista-entradas/lista-entradas';
import { DetalleEntrada } from './pages/public/detalle-entrada/detalle-entrada';
import { Login } from './pages/public/login/login';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { SobreMi } from './pages/public/sobre-mi/sobre-mi';


export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'sobre-mi', component: SobreMi },
      { path: 'entradas', component: ListaEntradas },
      { path: 'entradas/:slug', component: DetalleEntrada } 
    ]
  },

  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login }
    ]
  },

  { path: '**', redirectTo: '' } 
];
