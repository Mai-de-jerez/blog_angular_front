import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComentarioService } from '../../../core/services/comentario';
import { Comentario } from '../../../core/models/comentario';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Toast } from '../../../core/services/toast';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalle-comentario',
  imports: [DatePipe, ToastLocal],
  templateUrl: './detalle-comentario.html',
  styleUrl: './detalle-comentario.css',
  standalone: true
})
export class DetalleComentario implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comentarioService = inject(ComentarioService);
  private toastService = inject(Toast); 

  comentario = signal<Comentario | null>(null);
  cargando = signal(true);
  mostrarModalEliminar = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.comentarioService.getComentarioPorId(id).subscribe({
      next: (c) => {
        this.comentario.set(c);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.toastService.mostrar('Error al cargar el comentario', 'error');
        this.irAtras();
      }
    });
  }

  irAtras(): void {
    this.router.navigate(['/admin/comentarios']);
  }

  confirmarEliminar(): void { 
    this.mostrarModalEliminar.set(true); 
  }

  cancelarEliminar(): void { 
    this.mostrarModalEliminar.set(false); 
  }

  borrar(): void {
    const c = this.comentario();
    if (!c?.id) return;
    
    this.comentarioService.borrarComentario(c.id).subscribe({
      next: () => {
        this.mostrarModalEliminar.set(false);
        this.toastService.mostrar('Comentario eliminado correctamente', 'success');
        setTimeout(() => this.router.navigate(['/admin/comentarios']), 1500);
      },
      error: () => {
        this.mostrarModalEliminar.set(false);
        this.toastService.mostrar('No se pudo eliminar el comentario', 'error');
      }
    });
  }
}
