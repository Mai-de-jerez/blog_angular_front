import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../core/services/categoria'; 
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Toast } from '../../../core/services/toast';
import { Router } from '@angular/router';
import { Categoria } from '../../../core/models/categoria';
import { Filtro } from '../../../shared/components/filtro/filtro';
import { Paginador } from '../../../shared/components/paginador/paginador';

@Component({
  selector: 'app-lista-categorias-admin',
  imports: [CommonModule, ToastLocal, Filtro, Paginador],
  templateUrl: './lista-categorias-admin.html',
  styleUrl: './lista-categorias-admin.css',
  standalone: true
})
export class ListaCategoriasAdmin implements OnInit {

  // Inyección de servicios
  readonly categoriaService = inject(CategoriaService);
  private router = inject(Router); 
  private toast = inject(Toast);

  // Variables de estado con Signals
  cargando = signal(true);
  mostrarModal = signal(false);
  idAEliminar = signal<number | null>(null);
  //categorias = signal<Categoria[]>([]);

  get pagina() { return this.categoriaService.categoriasPagina; }
  get paginaActual() { return this.categoriaService.paginaActual; }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.categoriaService.listarAdmin().subscribe({
      next: (data) => { 
        this.categoriaService.categoriasPagina.set(data); 
        this.cargando.set(false); 
      },
      error: () => this.cargando.set(false)
    });
  }

  onFiltro(filtros: any): void {
    this.categoriaService.idFiltro.set(filtros.id);
    this.categoriaService.nombreFiltro.set(filtros.c1); 

    const padreIdNum = filtros.c2 ? Number(filtros.c2) : null;
    this.categoriaService.padreIdFiltro.set(isNaN(padreIdNum!) ? null : padreIdNum);
    
    this.categoriaService.c3VacioFiltro.set(filtros.c3);
    
    this.categoriaService.paginaActual.set(0); 
    this.cargar();
  }

  onPage(page: number): void {
    this.categoriaService.paginaActual.set(page);
    this.cargar();
  }

  irACrear(): void {
    this.router.navigate(['/admin/categorias/crear']);
  }

  irAEditar(id: number): void {
    this.router.navigate(['/admin/categorias/editar', id]);
  }

  confirmarEliminar(id: number): void {
    this.idAEliminar.set(id);
    this.mostrarModal.set(true);
  }

  cancelar(): void {
    this.mostrarModal.set(false);
    this.idAEliminar.set(null);
  }

  eliminar(): void {
    const id = this.idAEliminar();
    if (!id) return;

    this.categoriaService.deleteCategoria(id).subscribe({
      next: () => {
        this.mostrarModal.set(false);
        this.idAEliminar.set(null);
        this.toast.mostrar('Categoría eliminada correctamente', 'success');
        this.cargar(); 
      },
      error: () => {
        this.mostrarModal.set(false);
        this.toast.mostrar('Error al eliminar la categoría', 'error');
      }
    });
  }
}