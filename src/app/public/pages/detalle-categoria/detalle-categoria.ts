import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria';
import { EntradaService } from '../../../core/services/entrada';
import { Categoria } from '../../../core/models/categoria';
import { Entrada } from '../../../core/models/entrada';
import { Pagina } from '../../../core/models/pagina';
import { CommonModule } from '@angular/common';
import { Paginador } from '../../../shared/components/paginador/paginador';

@Component({
  selector: 'app-detalle-categoria',
  standalone: true,
  imports: [CommonModule, Paginador],
  templateUrl: './detalle-categoria.html',
  styleUrl: './detalle-categoria.css'
})
export class DetalleCategoria implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private entradaService = inject(EntradaService);

  categoria = signal<Categoria | null>(null);
  pagina = signal<Pagina<Entrada> | null>(null);
  cargando = signal(true);
  paginaActual = signal(0);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.categoriaService.getCategoriaBySlug(slug).subscribe({
      next: (cat) => {
        this.categoria.set(cat);
        this.cargarEntradas();
      }
    });
  }

  cargarEntradas(): void {
    this.cargando.set(true);
    this.entradaService.categoriaPublico.set(this.categoria()!.nombre);
    this.entradaService.tituloPublico.set('');
    this.entradaService.autorPublico.set('');
    this.entradaService.paginaPublico.set(this.paginaActual());
    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        this.pagina.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onPage(page: number): void {
    this.paginaActual.set(page);
    this.cargarEntradas();
  }

  irADetalle(slug: string): void {
    this.router.navigate(['/entradas', slug]);
  }
}
