import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-publico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="public-filter-bar">
      <!-- Campo 1: Dinámico -->
      <div class="filter-group">
        <input type="text" [(ngModel)]="campo1" [placeholder]="label1" (keyup.enter)="enviar()">
      </div>

      <!-- Campo 2: Dinámico -->
      <div class="filter-group">
        <input type="text" [(ngModel)]="campo2" [placeholder]="label2" (keyup.enter)="enviar()">
      </div>

      <!-- Campo 3: Dinámico -->
      <div class="filter-group">
        <input type="text" [(ngModel)]="campo3" [placeholder]="label3" (keyup.enter)="enviar()">
      </div>

      <div class="filter-actions">
        <button class="btn-search" (click)="enviar()">
          <span>Buscar</span>
        </button>
        <button class="btn-clear" (click)="limpiar()" title="Limpiar filtros">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .public-filter-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filter-group { 
      flex: 1; 
      min-width: 150px; 
    }
    input {
      width: 100%; /* Para que ocupe el ancho de su grupo */
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box; /* Crucial para que el padding no rompa el ancho */
    }
    .filter-actions { 
      display: flex; 
      gap: 8px; 
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-search {
      background: #333;
      color: white;
    }
    .btn-clear {
      background: #eee;
      color: #333;
    }
  `]
})
export class FiltroPublico {
  @Input() label1 = 'Buscar...';
  @Input() label2 = 'Categoría...';
  @Input() label3 = 'Autor...';

  @Output() alFiltrar = new EventEmitter<any>();

  campo1 = '';
  campo2 = '';
  campo3 = '';

  enviar() {
    this.alFiltrar.emit({
      c1: this.campo1.trim(),
      c2: this.campo2.trim(),
      c3: this.campo3.trim()
    });
  }

  limpiar() {
    this.campo1 = '';
    this.campo2 = '';
    this.campo3 = '';
    this.enviar();
  }
}