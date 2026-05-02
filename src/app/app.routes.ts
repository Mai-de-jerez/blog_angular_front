import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './pages/public/home/home';
import { ListaEntradas } from './pages/public/lista-entradas/lista-entradas';
import { DetalleEntrada } from './pages/public/detalle-entrada/detalle-entrada';


export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'entradas/:id', component: DetalleEntrada }, 
      { path: 'entradas', component: ListaEntradas },
    ]
  }
];
