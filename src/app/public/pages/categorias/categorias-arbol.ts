import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from '../../../core/models/categoria';

@Component({
  selector: 'app-categoria-arbol',
  standalone: true,
  imports: [CategoriaArbol],
  template: `
    @for (cat of categorias(); track cat.id) {
      <div [class]="nivel() === 0 ? 'cat-padre' : 'cat-hija'"
           [style.marginLeft.px]="nivel() * 20"
           (click)="irACategoria(cat.nombre)">
        {{ nivel() > 0 ? '— ' : '' }}{{ cat.nombre }}
      </div>
      <app-categoria-arbol 
        [categorias]="hijas(cat.id!)" 
        [todas]="todas()" 
        [nivel]="nivel() + 1">
      </app-categoria-arbol>
    }
  `,
  styles: [`
    .cat-padre {
      font-size: 1.1rem;
      font-weight: 700;
      color: #4b0082;
      letter-spacing: 0.08em;
      margin-top: 16px;
      cursor: pointer;
      font-family: 'Georgia', serif;
      text-decoration: none;
    }

    .cat-hija {
      font-size: 0.95rem;
      color: #333;
      margin-top: 6px;
      cursor: pointer;
      font-family: 'Georgia', serif;
    }
    .cat-hija:hover { color: #4b0082; }
  `]
})
export class CategoriaArbol {
  categorias = input<Categoria[]>([]);
  todas = input<Categoria[]>([]);
  nivel = input(0);

  private router = inject(Router);

  hijas(padreId: number) {
    return this.todas().filter(c => c.padreId === padreId);
  }

  irACategoria(nombre: string): void {
    this.router.navigate(['/entradas'], { queryParams: { categoria: nombre } });
  }
}