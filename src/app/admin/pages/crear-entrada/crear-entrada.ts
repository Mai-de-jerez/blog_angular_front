import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { FormEntrada } from '../../../shared/components/forms/form-entrada/form-entrada';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { EntradaPost } from '../../../core/models/entrada-post';

@Component({
  selector: 'app-crear-entrada',
  standalone: true,
  imports: [FormEntrada, ToastLocal],
  templateUrl: './crear-entrada.html',
  styleUrl: './crear-entrada.css',
})
export class CrearEntrada {
  private router = inject(Router);
  private entradaService = inject(EntradaService);
  private toastService = inject(Toast);

  nuevaEntrada: Partial<EntradaPost> = {
    titulo: '',
    contenido: '',
    categoriaId: undefined
  };

  crear(datos: Partial<EntradaPost>): void {
    const fd = new FormData();
    fd.append('titulo', datos.titulo || '');
    fd.append('contenido', datos.contenido || '');
    if (datos.categoriaId) fd.append('categoriaId', datos.categoriaId.toString());
    if (datos.imagenUrl instanceof File) fd.append('imagen', datos.imagenUrl, datos.imagenUrl.name);

    this.entradaService.crearEntrada(fd).subscribe({
      next: () => {
        this.toastService.mostrar('¡Entrada creada con éxito!', 'success');
        this.router.navigate(['/admin/entradas']);  // ← diferencia clave
      },
      error: (err) => {
        console.error('Error al crear:', err);
        this.toastService.mostrar('Error al guardar la nueva entrada', 'error');
      }
    });
  }
}
