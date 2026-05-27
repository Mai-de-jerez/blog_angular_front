import { Component, inject, input, output, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoriaService } from '../../../../core/services/categoria';
import { Categoria } from '../../../../core/models/categoria';
import { FieldError } from '../../field-error/field-error';
import { ToastLocal } from '../../toast-local/toast-local';
import { EntradaPost } from '../../../../core/models/entrada-post';

interface CategoriaSelectGroup { 
  label: string;
  data: number;
  groupLabel: string;
}

@Component({
  selector: 'app-form-entrada',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, FieldError, ToastLocal],
  templateUrl: './form-entrada.html',
  styleUrl: './form-entrada.css'
})
export class FormEntrada {
  private readonly fb = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);

  // Inputs para configurar el formulario desde el componente padre
  titulo = input<string>('Nueva Entrada');
  idEntradaEditando = input<number | null>(null);
  entrada = input<Partial<EntradaPost> | null>(null);
  cargando = signal(false);

  // Output para emitir los datos al componente padre
  save = output<EntradaPost>();
  cancel = output<void>();

  categoriasParaSelect = signal<CategoriaSelectGroup[]>([]);

  form = this.fb.group({
    titulo:      ['', [Validators.required, Validators.minLength(3)]],
    categoriaId: [null as number | null, Validators.required],
    contenido:   ['', [Validators.required, Validators.minLength(10)]],
    imagenUrl:   [null as string | File | null]
  });

  constructor() {
    // Cargar categorías al iniciar
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categoriasParaSelect.set(this.formatearParaSelect(categorias));
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });

    // Precargar datos si estamos editando
    effect(() => {
      const datos = this.entrada();
      if (datos) this.form.patchValue(datos);
    });
  }

  private formatearParaSelect(lista: Categoria[]): CategoriaSelectGroup[] {
    const result: CategoriaSelectGroup[] = [];
    const padres = lista.filter(c => !c.padreId);

    for (const padre of padres) {
      result.push({ label: padre.nombre, data: Number(padre.id), groupLabel: padre.nombre });

      const hijos = lista.filter(c => c.padreId === padre.id);
      for (const hijo of hijos) {
        result.push({ label: hijo.nombre, data: Number(hijo.id), groupLabel: padre.nombre });

        const nietos = lista.filter(c => c.padreId === hijo.id);
        for (const nieto of nietos) {
          result.push({ label: nieto.nombre, data: Number(nieto.id), groupLabel: hijo.nombre });
        }
      }
    }
    return result;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.form.patchValue({ imagenUrl: file }); 
  }

  onCancel() {
    this.cancel.emit(); 
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    const datos = this.form.getRawValue() as EntradaPost;
    this.save.emit(datos);
  }
}


