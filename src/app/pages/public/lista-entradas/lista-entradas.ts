import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { Entrada } from '../../../core/models/entrada';
import { Auth } from '../../../core/services/auth';
import { Pagina } from '../../../core/models/pagina';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { Filtro } from '../../../shared/components/filtro/filtro';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-lista-entradas',
  imports: [CommonModule, RouterLink, Paginador, Filtro, ToastLocal], 
  templateUrl: './lista-entradas.html',
  styleUrl: './lista-entradas.css',
  standalone: true
})

export class ListaEntradas implements OnInit {
  // inyección de servicios
  public authService = inject(Auth);
  public entradaService = inject(EntradaService);
  public readonly mediaUrl = environment.mediaUrl;

  // variables para datos, estado y errores
  pagina = signal<Pagina<Entrada> | null>(null);
  entradas = signal<Entrada[]>([]);
  cargando = signal(true);
  error = signal(''); 
  titulo = signal('');
  categoria = signal('');
  autor = signal('');
  paginaActual = signal(0);

  // método para cargar las entradas con filtros y paginación
  cargar(): void {
    this.cargando.set(true);
    this.entradaService.getEntradas(this.titulo(), this.categoria(), this.autor(), this.paginaActual()).subscribe({
      next: (data) => {
        this.pagina.set(data);
        this.entradas.set(data.contenido);
        this.cargando.set(false); 
      },
      error: (err) => {
        this.error.set('Error al cargar las entradas');
        this.cargando.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.cargar();
  }


  onFiltro(filtros: { titulo: string, categoria: string, autor: string }): void {
    this.titulo.set(filtros.titulo);
    this.categoria.set(filtros.categoria);
    this.autor.set(filtros.autor);
    this.paginaActual.set(0); 
    this.cargar();
  }

  onPage(page: number): void {
    this.paginaActual.set(page);
    this.cargar();
  }
}

