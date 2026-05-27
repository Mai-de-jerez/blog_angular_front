import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { Auth } from '../../../auth/services/auth';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { FiltroPublico } from '../../../shared/components/filtro-publico/filtro-publico';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { environment } from '../../../../environments/environment';
import { Entrada } from '../../../core/models/entrada';
import { Pagina } from '../../../core/models/pagina';

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
  titulo = signal('');
  categoria = signal('');
  autor = signal('');
  paginaActual = signal(0);
  pagina = signal<Pagina<Entrada> | null>(null);
  

  // Getters para el template
  get isLogged() { return this.authService.isLogged(); }

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.entradaService.categoriaFooter$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(cat => {
        this.categoria.set(cat);
        if (cat) this.cargar();
      });
    this.cargar();
  }

  // Métodos
  cargar(): void {
    this.cargando.set(true);
    this.entradaService.getEntradas(
      this.titulo(), 
      this.categoria(), 
      this.autor(), 
      this.paginaActual()
    ).subscribe({
      next: (data) => {
        this.pagina.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onFiltro(filtros: any): void {
    this.titulo.set(filtros.c1);
    this.categoria.set(filtros.c2);
    this.autor.set(filtros.c3);
    this.paginaActual.set(0);
    this.cargar();
  }

  onPage(page: number): void {
    this.paginaActual.set(page);
    this.cargar();
  }

  irACrear(): void {
    this.router.navigate(['/entradas/crear']);
  }

  irADetalle(slug: string): void {
    this.router.navigate(['/entradas', slug]);
  }

}

