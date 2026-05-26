import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Toast } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { Filtro } from '../../../shared/components/filtro/filtro';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { Router } from '@angular/router';

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
  readonly entradaService = inject(EntradaService);
  private router = inject(Router); 
  private toast = inject(Toast);

  // Estado de carga
  cargando = signal(true);
  mostrarModal = signal(false);
  idAEliminar = signal<number | null>(null);

  // Getters para el template
  get pagina() { return this.entradaService.paginaAdminData; }
  get paginaActual() { return this.entradaService.paginaActualAdmin; }

  // Ciclo de vida
  ngOnInit(): void {
    this.cargar();
  }

  // Métodos 
  cargar(): void {
    this.cargando.set(true);
    this.entradaService.getEntradasAdmin().subscribe({
      next: (data) => {
        this.entradaService.paginaAdminData.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onFiltro(filtros: any): void {
    this.entradaService.idAdmin.set(filtros.id);
    this.entradaService.tituloAdmin.set(filtros.c1);   
    this.entradaService.categoriaAdmin.set(filtros.c2);
    this.entradaService.autorAdmin.set(filtros.c3);        
    this.entradaService.paginaActualAdmin.set(0);
    this.cargar();
  }

  onPage(page: number): void {
    this.entradaService.paginaActualAdmin.set(page);
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
 