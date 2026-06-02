import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../core/services/categoria';
import { FormCategoria } from '../../../shared/components/forms/form-categoria/form-categoria';
import { Categoria } from '../../../core/models/categoria';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [CommonModule, FormCategoria, ToastLocal],
  templateUrl: './editar-categoria.html',
  styleUrl: './editar-categoria.css',
})
export class EditarCategoria implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private toastService = inject(Toast);

  categoriaCargada = signal<Categoria | null>(null);
  guardando = signal<boolean>(false); 

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.categoriaService.getCategoria(id).subscribe({
        next: (res) => this.categoriaCargada.set(res),
        error: (err) => {
          console.error('Error al cargar la categoría:', err);
          this.toastService.mostrar('No se ha podido cargar la categoría', 'error');
          this.router.navigate(['/admin/categorias']);
        }
      });
    }
  }

  actualizar(datos: any): void {
    const categoria = this.categoriaCargada();
    if (categoria?.id) {
      this.guardando.set(true);

      const categoriaEditada: Categoria = {
        id: categoria.id,
        nombre: datos.nombre,
        padreId: datos.padreId || null,
        nombrePadre: categoria.nombrePadre || null 
      };

      this.categoriaService.updateCategoria(categoria.id, categoriaEditada).subscribe({
        next: () => {
          this.toastService.mostrar('Categoría actualizada con éxito', 'success');
          this.router.navigate(['/admin/categorias']);
        },
        error: (err) => {
          console.error('Error al actualizar la categoría:', err);
          this.toastService.mostrar('Error al modificar la categoría', 'error');
          this.guardando.set(false); // Liberamos el botón si algo falla
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/admin/categorias']);
  }
}
