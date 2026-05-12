import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { Entrada } from '../../../core/models/entrada';
import { Auth } from '../../../core/services/auth';
import { Pagina } from '../../../core/models/pagina';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { Filtro } from '../../../shared/components/filtro/filtro';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

@Component({
  selector: 'app-lista-entradas',
  imports: [CommonModule, RouterLink, Paginador, Filtro, ToastLocal], 
  templateUrl: './lista-entradas.html',
  styleUrl: './lista-entradas.css',
  standalone: true
})

export class ListaEntradas implements OnInit {

  public authService = inject(Auth);

  // variables para datos, estado y errores
  pagina: Pagina<Entrada> | null = null;
  entradas: Entrada[] = [];
  cargando: boolean = true;
  error: string = '';

  // variables para filtros y paginación
  titulo = '';
  categoria = '';
  autor = '';
  paginaActual = 0;

  // inyección de servicios
  constructor(private entradaService: EntradaService, private cdr: ChangeDetectorRef) {}
  // método para cargar las entradas con filtros y paginación
  cargar(): void {
    this.cargando = true;
    this.entradaService.getEntradas(this.titulo, this.categoria, this.autor, this.paginaActual).subscribe({
      next: (data) => {
        this.pagina = data;
        this.entradas = data.contenido;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar las entradas';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  onFiltro(filtros: { titulo: string, categoria: string, autor: string }): void {
    this.titulo = filtros.titulo;
    this.categoria = filtros.categoria;
    this.autor = filtros.autor;
    this.paginaActual = 0; 
    this.cargar();
  }

  onPage(page: number): void {
    this.paginaActual = page;
    this.cargar();
  }
}

