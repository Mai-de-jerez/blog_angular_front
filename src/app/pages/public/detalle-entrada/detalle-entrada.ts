import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { Auth } from '../../../auth/services/auth';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { environment } from '../../../../environments/environment';
import { Comentarios } from '../../../shared/components/comentarios/comentarios';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-detalle-entrada',
  imports: [CommonModule, DatePipe, ToastLocal, Comentarios],
  templateUrl: './detalle-entrada.html',
  styleUrl: './detalle-entrada.css',
  standalone: true
}) 

export class DetalleEntrada implements OnInit {

  // Inyectamos los servicios necesarios 
  private authService = inject(Auth); 
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(Toast);
  private entradaService = inject(EntradaService);
  public readonly mediaUrl = environment.mediaUrl;

  get entrada() { return this.entradaService.entradaDetalle; }
  get puedeGestionar(): boolean {
    return this.authService.isAdmin() || this.authService.userId() === this.entrada()?.autorId;
  }

  // variables para manejar el estado
  cargando = signal(true);

  // Para volver a la página anterior
  irAtras(): void {
    this.router.navigate(['/entradas']);
  }

  // Para ir a la página de edición
  irAEditar(): void {
    const e = this.entrada();
    if (e) {
      this.router.navigate(['/entradas/editar-entrada', e.slug]);
    }
  }

  // Para eliminar la entrada
  borrar(): void {
    const e = this.entrada();
    if (!e?.id) return;
    this.entradaService.deleteEntrada(e.id).subscribe({
      next: () => {
        this.toastService.mostrar('Entrada eliminada correctamente', 'success');
        setTimeout(() => this.router.navigate(['/entradas']), 1500);
      }
    });
  }

  // método para cargar la entrada al iniciar el componente
  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.entradaService.getEntradaBySlug(slug).subscribe({
        next: (data) => {
          this.entradaService.entradaDetalle.set(data)
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
        }
      });
    } else {
      this.cargando.set(false);
    }
  }

  // Limpiamos el detalle al destruir el componente para evitar mostrar datos antiguos si se vuelve a cargar
  ngOnDestroy(): void {
    this.entradaService.resetDetalle();
  }
}


