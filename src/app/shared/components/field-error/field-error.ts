import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-field-error',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (control()?.touched && control()?.invalid) {
      <span class="error-text">{{ mensaje }}</span>
    }
  `,
  styleUrl: './field-error.css'
})
export class FieldError {
  control = input<AbstractControl | null>(null);
  mensajes = input<Record<string, string>>({});

  get mensaje(): string {
    const c = this.control();
    const custom = this.mensajes();
    if (c?.hasError('required')) return custom['required'] ?? 'Este campo es obligatorio';
    if (c?.hasError('email')) return custom['email'] ?? 'El email no es válido';
    if (c?.hasError('minlength')) return custom['minlength'] ?? `Mínimo ${c.getError('minlength').requiredLength} caracteres`;
    if (c?.hasError('maxlength')) return custom['maxlength'] ?? `Máximo ${c.getError('maxlength').requiredLength} caracteres`;
    if (c?.hasError('pattern')) return custom['pattern'] ?? 'Formato no válido';
    return '';
  }
}