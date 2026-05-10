import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filtro-container">
      <input 
        type="text" 
        [(ngModel)]="titulo" 
        placeholder="Buscar por título..."
        (keyup.enter)="buscar()">
      
      <input 
        type="text" 
        [(ngModel)]="categoria" 
        placeholder="Categoría...">
      
      <input 
        type="text" 
        [(ngModel)]="autor" 
        placeholder="Autor...">

      <button (click)="buscar()">Buscar</button>
      <button (click)="limpiar()">✕</button>
    </div>
  `,
  styles: [`
    .filtro-container {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    input {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      flex: 1;
      min-width: 150px;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:first-of-type {
      background: #333;
      color: white;
    }
    button:last-of-type {
      background: #eee;
    }
  `]
})
export class Filtro {
  @Output() filtroChanged = new EventEmitter<{ titulo: string, categoria: string, autor: string }>();

  titulo = '';
  categoria = '';
  autor = '';

  buscar(): void {
    this.filtroChanged.emit({
      titulo: this.titulo.trim() || '',
      categoria: this.categoria.trim() || '',
      autor: this.autor.trim() || ''
    });
  }

  limpiar(): void {
    this.titulo = '';
    this.categoria = '';
    this.autor = '';
    this.buscar();
  }
}
