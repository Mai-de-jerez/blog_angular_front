import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="paginador" *ngIf="totalPaginas > 1">
      <!-- Botón Anterior -->
      <button [disabled]="paginaActual === 0" (click)="cambiar(paginaActual - 1)">
        ←
      </button>

      @for (p of paginasVisibles; track $index) {
        @if (p === '...') {
          <span class="puntos">...</span>
        } @else {
          <button 
            [class.activa]="p === paginaActual"
            (click)="cambiar(p)">
            {{ +p + 1 }}
          </button>
        }
      }

      <!-- Botón Siguiente -->
      <button [disabled]="paginaActual === totalPaginas - 1" (click)="cambiar(paginaActual + 1)">
        →
      </button>
    </div>
  `,
  styles: [`
    .paginador { display: flex; gap: 8px; justify-content: center; align-items: center; margin-top: 24px; }
    button { padding: 8px 14px; border: 1px solid #ccc; background: white; cursor: pointer; border-radius: 4px; transition: 0.2s; }
    button.activa { background: #333; color: white; border-color: #333; }
    button:disabled { opacity: 0.4; cursor: not-allowed; }
    .puntos { padding: 0 4px; color: #666; font-weight: bold; }

    @media (max-width: 768px) {
      .paginador { gap: 4px; flex-wrap: wrap; padding: 0 8px; }
      button { padding: 6px 10px; font-size: 0.85rem; min-width: 36px; }
    }
  `]
})
export class Paginador {
  @Input() totalPaginas: number = 0; // para comunicar el total de páginas al componente
  @Input() paginaActual: number = 0; // para comunicar la página actual al componente
  @Output() pageChanged = new EventEmitter<number>(); // para emitir el número de página seleccionado al componente padre

  // Calcula las páginas visibles para mostrar en el paginador
  get paginasVisibles(): (number | string)[] {
    const paginas: (number | string)[] = [];
    const total = this.totalPaginas;
    const actual = this.paginaActual;

    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i);
    }

    // Siempre mostramos la primera
    paginas.push(0);

    if (actual > 2) paginas.push('...');

    // Páginas centrales (alrededor de la actual)
    const inicio = Math.max(1, actual - 1);
    const fin = Math.min(total - 2, actual + 1);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    if (actual < total - 3) paginas.push('...');

    // Siempre mostramos la última
    paginas.push(total - 1);

    return paginas;
  }

  // Maneja el cambio de página cuando el usuario hace clic en un número de página o en los botones de navegación
  cambiar(page: any): void {
    const p = Number(page);
    if (!isNaN(p) && p >= 0 && p < this.totalPaginas && p !== this.paginaActual) {
      this.pageChanged.emit(p);
    }
  }
}