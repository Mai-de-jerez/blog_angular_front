import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  readonly entradaService = inject(EntradaService);
  readonly mediaUrl = environment.mediaUrl;
  private router = inject(Router); 
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Estado de carga
  cargando = signal(true);
  pagina = signal<Pagina<Entrada> | null>(null);  

  // Getters para el template
  get isLogged() { return this.authService.isLogged(); }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      if (params['categoria']) {
        this.entradaService.tituloPublico.set('');
        this.entradaService.autorPublico.set('');
        this.entradaService.paginaPublico.set(0);
        this.entradaService.categoriaPublico.set(params['categoria']);
      }
      this.cargar();
    });
  }

  // Métodos
  cargar(): void {
    this.cargando.set(true);
    this.entradaService.getEntradas().subscribe({
      next: (data) => { this.pagina.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false)
    });
  }

  // Manejo de filtros
  onFiltro(filtros: any): void {
    this.entradaService.tituloPublico.set(filtros.c1);
    this.entradaService.categoriaPublico.set(filtros.c2);
    this.entradaService.autorPublico.set(filtros.c3);
    this.entradaService.paginaPublico.set(0);
    this.cargar();
  }

  // Manejo de paginación
  onPage(page: number): void {
    this.entradaService.paginaPublico.set(page);
    this.cargar();
  }

  irACrear(): void {
    this.router.navigate(['/entradas/crear']);
  }

  irADetalle(slug: string): void {
    this.router.navigate(['/entradas', slug]);
  }
}

