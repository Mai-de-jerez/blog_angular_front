import { Component, inject, input, output, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoriaService } from '../../../../core/services/categoria';
import { Categoria } from '../../../../core/models/categoria';
import { FieldError } from '../../field-error/field-error';
import { ToastLocal } from '../../toast-local/toast-local';

@Component({
  selector: 'app-form-categoria',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, FieldError, ToastLocal],
  templateUrl: './form-categoria.html',
  styleUrl: './form-categoria.css'
})
export class FormCategoria {
  private readonly fb = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);

  // Inputs de configuración - Corregido a input() como en FormUsuario
  titulo = input<string>('Nueva Categoría');
  idCategoriaEditando = input<number | null>(null);
  categoria = input<Partial<Categoria> | null>(null);
  cargando = input<boolean>(false); // ← Cambiado de signal a input

  // Outputs para el componente padre
  save = output<Categoria>();
  cancel = output<void>();

  // Lista limpia de posibles categorías padre (este sí es un signal interno)
  categoriasPadreParaSelect = signal<Categoria[]>([]);

  form = this.fb.group({
    nombre:  ['', [Validators.required, Validators.minLength(2)]],
    padreId: [null as number | null] 
  });

  constructor() {
    // Cargar las categorías del servidor
    this.categoriaService.getCategorias().subscribe({
      next: (lista: Categoria[]) => {
        this.filtrarPosiblesPadres(lista);
      },
      error: (err) => console.error('Error al cargar categorías padre:', err)
    });

    // Efecto para reactividad de precarga si entramos en modo edición
    effect(() => {
      const datos = this.categoria();
      if (datos) {
        this.form.patchValue({
          nombre: datos.nombre || '',
          padreId: datos.padreId || null
        });
      }
    });
  }

  private filtrarPosiblesPadres(lista: Categoria[]): void {
    const idEditando = this.idCategoriaEditando();
    if (idEditando) {
      this.categoriasPadreParaSelect.set(lista.filter(c => Number(c.id) !== Number(idEditando)));
    } else {
      this.categoriasPadreParaSelect.set(lista);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    // Validamos usando el input cargando() exactamente igual que en tu FormUsuario
    if (!this.cargando()) {
      const datos = this.form.getRawValue() as Categoria;
      this.save.emit(datos);
    }
  }
}