import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="paginador" *ngIf="totalPaginas > 1">
      <button 
        [disabled]="paginaActual === 0" 
        (click)="cambiar(paginaActual - 1)">
        ←
      </button>

      @for (p of paginas; track p) {
        <button 
          [class.activa]="p === paginaActual"
          (click)="cambiar(p)">
          {{ p + 1 }}
        </button>
      }

      <button 
        [disabled]="paginaActual === totalPaginas - 1" 
        (click)="cambiar(paginaActual + 1)">
        →
      </button>
    </div>
  `,
  styles: [`
    .paginador {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 24px;
    }
    button {
      padding: 8px 14px;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    button.activa {
      background: #333;
      color: white;
      border-color: #333;
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `]
})
export class Paginador {
  @Input() totalPaginas: number = 0;
  @Input() paginaActual: number = 0;
  @Output() pageChanged = new EventEmitter<number>();

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  cambiar(page: number): void {
    if (page >= 0 && page < this.totalPaginas) {
      this.pageChanged.emit(page);
    }
  }
}
