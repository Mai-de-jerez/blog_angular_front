import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../input/input';
import { SelectComponent } from '../../select/select';
import { TextareaComponent } from '../../textarea/textarea';
import { FormsModule } from '@angular/forms';
import { Entrada } from '../../../../core/models/entrada';
 

@Component({
  selector: 'app-form-entrada',
  imports: [CommonModule, FormsModule, InputComponent, SelectComponent, TextareaComponent],
  templateUrl: './form-entrada.html',
  styleUrl: './form-entrada.css',
})

export class FormEntrada {

  @Input() entrada: Partial<Entrada> = {};
  @Output() save = new EventEmitter<Partial<Entrada>>();

  categoriasDisponibles: string[] = ['cine', 'arte', 'hogar'];

  onSubmit() {
    this.save.emit(this.entrada);
  }
}


