import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria';
import { FormCategoria } from '../../../shared/components/forms/form-categoria/form-categoria'; // Tu ruta real
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Categoria } from '../../../core/models/categoria';

@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  imports: [FormCategoria, ToastLocal],
  templateUrl: './crear-categoria.html',
  styleUrl: './crear-categoria.css',
})
export class CrearCategoria {
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private toastService = inject(Toast);

  guardando = signal(false);

  // Inicializamos el objeto parcial de la nueva categoría sin ID
  nuevaCategoria: Partial<Categoria> = {
    nombre: '',
    padreId: null
  };

  registrarCategoria(datos: Partial<Categoria>): void {
    this.guardando.set(true);

    // Mandamos el objeto 'datos' directamente en formato JSON (sin FormData)
    this.categoriaService.crearCategoria(datos).subscribe({
      next: () => {
        this.toastService.mostrar('¡Categoría creada con éxito!', 'success');
        this.router.navigate(['/admin/categorias']); // Tu ruta de listado
      },
      error: (err) => {
        console.error('Error al crear la categoría:', err);
        this.toastService.mostrar('Error al guardar la nueva categoría', 'error');
        this.guardando.set(false); // Liberamos el botón si falla
      }
    });
  }

  volver(): void {
    this.router.navigate(['/admin/categorias']);
  }
}
