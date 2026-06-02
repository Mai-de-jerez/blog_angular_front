import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria';
import { Categoria } from '../../../core/models/categoria';
import { CategoriaArbol } from './categorias-arbol';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CategoriaArbol],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {

  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  padres = computed(() => this.categorias().filter(c => !c.padreId));

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
