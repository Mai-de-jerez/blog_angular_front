import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../input/input';
import { OpcionSelect, SelectComponent } from '../../select/select';
import { TextareaComponent } from '../../textarea/textarea';
import { FormsModule } from '@angular/forms';
import { Entrada } from '../../../../core/models/entrada';
import { CategoriaService } from '../../../../core/services/categoria';
 

@Component({
  selector: 'app-form-entrada',
  imports: [CommonModule, FormsModule, InputComponent, SelectComponent, TextareaComponent],
  templateUrl: './form-entrada.html',
  styleUrl: './form-entrada.css',
})
export class FormEntrada implements OnInit {

  private categoriaService = inject(CategoriaService);

  @Input() entrada: Partial<Entrada> = {};
  @Output() save = new EventEmitter<Partial<Entrada>>();

  opcionesCategoria: OpcionSelect[] = [];

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        this.opcionesCategoria = categorias.flatMap(cat => {
          const opciones: OpcionSelect[] = [{ valor: cat.id!, etiqueta: cat.nombre }];
          if (cat.subcategorias?.length) {
            cat.subcategorias.forEach(sub => {
              opciones.push({ valor: sub.id!, etiqueta: `${cat.nombre} > ${sub.nombre}` });
            });
          }
          return opciones;
        });
      }
    });
  }

  onSubmit() {
    this.save.emit(this.entrada);
  }
}


