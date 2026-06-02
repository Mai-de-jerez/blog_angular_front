import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioService } from '../../../core/services/comentario';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Toast } from '../../../core/services/toast';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { Comentario } from '../../../core/models/comentario';
import { Pagina } from '../../../core/models/pagina';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-comentarios',
  imports: [CommonModule, ToastLocal, Paginador],
  templateUrl: './listar-comentarios.html',
  styleUrl: './listar-comentarios.css',
  standalone: true
})
export class ListarComentarios implements OnInit {

  // Inyección de servicios
  readonly comentarioService = inject(ComentarioService);
  private toast = inject(Toast);
  private router = inject(Router);

  // Estados reactivos (Señales)
  cargando = signal(true);
  mostrarModal = signal(false);
  idAEliminar = signal<number | null>(null);
  pagina = signal<Pagina<Comentario> | null>(null);

  // Ciclo de vida: cargamos al arrancar
  ngOnInit(): void {
    this.cargar();
  }

  // Recupera los datos del backend usando la señal del servicio para la página activa
  cargar(): void {
    this.cargando.set(true);
    this.comentarioService.getTodosLosComentariosAdmin(
      this.comentarioService.paginaAdminTodo()
    ).subscribe({
      next: (data) => {
        this.pagina.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.toast.mostrar('Error al cargar el listado de comentarios', 'error');
      }
    });
  }

  // Manejo del cambio de página
  onPage(page: number): void {
    this.comentarioService.paginaAdminTodo.set(page);
    this.cargar();
  }

  irAVer(id: number) {
    this.router.navigate(['/admin/comentarios/detalle', id]);
  }

  // Confirmación y ejecución del borrado
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

    this.comentarioService.borrarComentario(id).subscribe({
      next: () => {
        this.mostrarModal.set(false);
        this.idAEliminar.set(null);
        this.toast.mostrar('Comentario eliminado correctamente', 'success');
        this.cargar(); // Recarga la página actual
      },
      error: () => {
        this.mostrarModal.set(false);
        this.toast.mostrar('Error al eliminar el comentario', 'error');
      }
    });
  }
}
