import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-filter-bar">
      <!-- Campo 1: Siempre el ID -->
      <div class="filter-group id-field">
        <input type="number" [(ngModel)]="id" [placeholder]="labelId">
      </div>

      <!-- Campo 2: Dinámico (Título, Username...) -->
      <div class="filter-group">
        <input type="text" [(ngModel)]="campo1" [placeholder]="label1" (keyup.enter)="enviar()">
      </div>

      <!-- Campo 3: Dinámico (Categoría, Nombre...) -->
      <div class="filter-group">
        <input type="text" [(ngModel)]="campo2" [placeholder]="label2" (keyup.enter)="enviar()">
      </div>

      <!-- Campo 4: Dinámico (Autor, Apellidos...) -->
      <div class="filter-group">
        <input type="text" [(ngModel)]="campo3" [placeholder]="label3" (keyup.enter)="enviar()">
      </div>

      <div class="filter-actions">
        <button class="btn-search" (click)="enviar()">Buscar</button>
        <button class="btn-clear" (click)="limpiar()">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .admin-filter-bar {
      display: flex;
      gap: 12px;
      background: #f4f4f4;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      align-items: center;
      flex-wrap: wrap;
    }
    .filter-group { flex: 1; min-width: 150px; }
    .id-field { flex: 0 0 90px; min-width: 90px; }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
    }
    input:focus { border-color: #333; }

    .filter-actions { display: flex; gap: 8px; }
    .btn-search { background: #333; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-clear { background: #ddd; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
    .btn-search:hover { background: #000; }
  `]
})
export class Filtro {
  // Etiquetas que cambian según la entidad
  @Input() labelId = 'ID...';
  @Input() label1 = 'Campo 1...';
  @Input() label2 = 'Campo 2...';
  @Input() label3 = 'Campo 3...';

  @Output() alFiltrar = new EventEmitter<any>();

  id?: number;
  campo1 = '';
  campo2 = '';
  campo3 = '';

  enviar() {
    this.alFiltrar.emit({
      id: this.id,
      c1: this.campo1.trim(),
      c2: this.campo2.trim(),
      c3: this.campo3.trim()
    });
  }

  limpiar() {
    this.id = undefined;
    this.campo1 = '';
    this.campo2 = '';
    this.campo3 = '';
    this.enviar();
  }
}
