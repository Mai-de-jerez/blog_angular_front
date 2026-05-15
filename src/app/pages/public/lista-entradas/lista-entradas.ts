import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { Auth } from '../../../core/services/auth';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { FiltroPublico } from '../../../shared/components/filtro-publico/filtro-publico';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-lista-entradas',
  imports: [CommonModule, Paginador, FiltroPublico, ToastLocal],
  templateUrl: './lista-entradas.html',
  styleUrl: './lista-entradas.css',
  standalone: true
})
export class ListaEntradas implements OnInit {

  // Inyección de servicios
  private authService = inject(Auth);
  private entradaService = inject(EntradaService);
  readonly mediaUrl = environment.mediaUrl;
  private router = inject(Router);

  // Estado de carga
  cargando = signal(true);

  // Getters para el template
  get isLogged() { return this.authService.isLogged(); }
  get pagina() { return this.entradaService.pagina; }
  get paginaActual() { return this.entradaService.paginaActual; }

  // Ciclo de vida
  ngOnInit(): void {
    this.cargar();
  }

  // Métodos
  cargar(): void {
    this.cargando.set(true);
    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        this.entradaService.pagina.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  onFiltro(filtros: any): void {
    this.entradaService.titulo.set(filtros.c1);    
    this.entradaService.categoria.set(filtros.c2); 
    this.entradaService.autor.set(filtros.c3);         
    this.entradaService.paginaActual.set(0);
    this.cargar();
  }

  onPage(page: number): void {
    this.entradaService.paginaActual.set(page);
    this.cargar();
  }

  irACrear(): void {
  this.router.navigate(['/entradas/crear']);
}

  irADetalle(slug: string): void {
    this.router.navigate(['/entradas', slug]);
  }

}

