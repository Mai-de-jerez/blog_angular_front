import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { FormEntrada } from '../../../shared/components/forms/form-entrada/form-entrada';
import { Entrada } from '../../../core/models/entrada';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-editar-entrada',
  imports: [CommonModule, FormEntrada, ToastLocal],
  templateUrl: './editar-entrada.html',
  styleUrl: './editar-entrada.css',
  standalone: true
})
export class EditarEntrada implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entradaService = inject(EntradaService);
  private toastService = inject(Toast);
  private authService = inject(Auth); 

  entradaCargada = signal<Entrada | null>(null);

  ngOnInit(): void {
      const slug = this.route.snapshot.paramMap.get('slug');

      if (slug) {
          this.entradaService.getEntradaBySlug(slug).subscribe({
              next: (res) => {
                  // ---  SEGURIDAD ---
                  const usuarioId = Number(this.authService.getUsuarioId()); 
                  const autorId = Number(res.autorId);
                  const isAdmin = this.authService.isAdmin();

                  // Si no es autor ni admin, no puede editar
                  if (autorId !== usuarioId && !isAdmin) {
                      this.toastService.mostrar('No tienes permiso para editar esto', 'error');
                      this.router.navigate(['/entradas']);
                      return; // Cortamos la ejecución aquí
                  }
                  this.entradaCargada.set(res);
              },
              error: () => {
                  this.toastService.mostrar('No se ha podido cargar la entrada', 'error');
                  this.router.navigate(['/entradas']);
              }
          });
      }
  }

  actualizar(datos: any): void {  
    const entrada = this.entradaCargada();
    if (entrada?.id) {
      const fd = new FormData();
      fd.append('titulo', datos.titulo);
      fd.append('contenido', datos.contenido);
      if (datos.categoriaId) fd.append('categoriaId', datos.categoriaId.toString());
      if (datos.imagenUrl instanceof File) fd.append('imagen', datos.imagenUrl, datos.imagenUrl.name);

      this.entradaService.updateEntrada(entrada.id, fd).subscribe({
        next: (entradaActualizada) => {
          this.toastService.mostrar('¡Entrada actualizada con éxito!', 'success');
          this.router.navigate(['/entradas', entradaActualizada.slug]);
        },
        error: (err) => {
          console.error('Error al editar:', err);
          this.toastService.mostrar('Error al validar los datos', 'error');
        }
      });
    }
  }

  volverAlListadoPublico(): void {
    this.router.navigate(['/entradas']);
  }
}



