import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Toast } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { Filtro } from '../../../shared/components/filtro/filtro';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { Router } from '@angular/router';
import { Entrada } from '../../../core/models/entrada';
import { Pagina } from '../../../core/models/pagina';

@Component({
  selector: 'app-lista-entradas-admin',
  imports: [CommonModule, ToastLocal, Paginador, Filtro],
  templateUrl: './lista-entradas-admin.html',
  styleUrl: './lista-entradas-admin.css',
  standalone: true
})
export class ListaEntradasAdmin implements OnInit {

  // Inyección de servicios
  readonly mediaUrl = environment.mediaUrl;
  private  entradaService = inject(EntradaService);
  private router = inject(Router); 
  private toast = inject(Toast);

  // Estado de carga
  cargando = signal(true);
  mostrarModal = signal(false);
  idAEliminar = signal<number | null>(null);
  idAdmin = signal<number | null>(null);
  tituloAdmin = signal('');
  categoriaAdmin = signal('');
  autorAdmin = signal('');
  paginaActual = signal(0);
  pagina = signal<Pagina<Entrada> | null>(null);

  // Ciclo de vida
  ngOnInit(): void {
    this.cargar();
  }

  // Métodos 
  cargar(): void {
    this.cargando.set(true);
    this.entradaService.getEntradasAdmin(
      this.idAdmin(),
      this.tituloAdmin(),
      this.categoriaAdmin(),
      this.autorAdmin(),
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
    this.idAdmin.set(filtros.id);
    this.tituloAdmin.set(filtros.c1);
    this.categoriaAdmin.set(filtros.c2);
    this.autorAdmin.set(filtros.c3);
    this.paginaActual.set(0);
    this.cargar();
  }

  onPage(page: number): void {
    this.paginaActual.set(page);
    this.cargar();
  }

  irAEditar(id: number): void {
    this.router.navigate(['/admin/entradas/editar', id]);
  }

  irACrear(): void {
    this.router.navigate(['/admin/entradas/crear']);
  }

  eliminar(): void {
  const id = this.idAEliminar();
  if (!id) return;
  this.entradaService.deleteEntrada(id).subscribe({
    next: () => {
      this.mostrarModal.set(false);
      this.idAEliminar.set(null);
      this.toast.mostrar('Entrada eliminada correctamente', 'success');
      this.cargar();
    },
    error: () => {
      this.mostrarModal.set(false);
      this.toast.mostrar('Error al eliminar la entrada', 'error');
    }
  });
}

  confirmarEliminar(id: number): void {
  this.idAEliminar.set(id);
  this.mostrarModal.set(true);
}

  cancelar(): void {
    this.mostrarModal.set(false);
    this.idAEliminar.set(null);
  }
} 
 