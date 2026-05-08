import { Component, ChangeDetectorRef, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputComponent } from '../../input/input';
import { TextareaComponent } from '../../textarea/textarea';
import { Entrada } from '../../../../core/models/entrada';
import { CategoriaService } from '../../../../core/services/categoria';
import { Categoria } from '../../../../core/models/categoria';

@Component({
  selector: 'app-form-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, TextareaComponent, TreeSelectModule],
  templateUrl: './form-entrada.html',
  styleUrl: './form-entrada.css'
})
export class FormEntrada implements OnInit {
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Usamos un setter para detectar cuando la entrada cargada por el signal llega aquí
  private _entrada: Partial<Entrada> = {};
  @Input() set entrada(val: Partial<Entrada>) {
    this._entrada = val;
    this.marcarCategoriaActual(); 
  }
  get entrada() { return this._entrada; }

  @Output() save = new EventEmitter<Partial<Entrada>>();

  categoriasArbol: any[] = [];
  nodoSeleccionado: any = null;

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categoriasArbol = this.formatearArbol(categorias, null);
        this.marcarCategoriaActual(); // También lo intentamos al cargar el árbol
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  private formatearArbol(lista: Categoria[], padreId: number | null): any[] {
  return lista
    .filter(c => c.padreId === padreId)
    .map(c => ({
      label: c.nombre,
      data: Number(c.id),        // ← CAMBIO
      key: c.id?.toString(),
      children: this.formatearArbol(lista, c.id!)
    }));
  }

  private marcarCategoriaActual() {
    if (this._entrada?.categoriaId && this.categoriasArbol.length > 0) {
      const id = Number(this._entrada.categoriaId);
      this.nodoSeleccionado = this.encontrarNodo(this.categoriasArbol, id);
      this.cdr.detectChanges(); // ← fuerza a Angular a re-evaluar la vista
    }
  }

  private encontrarNodo(nodos: any[], id: number): any {
    for (const nodo of nodos) {
      if (Number(nodo.data) === id) return nodo;             
      if (nodo.children?.length) {
        const hijo = this.encontrarNodo(nodo.children, id);
        if (hijo) return hijo;
      }
    }
    return null;
  }

  onNodeSelect(event: any) {
    this.entrada.categoriaId = event.node.data;
  }

  onCancel() {
    if (this.entrada?.slug) {
      this.router.navigate(['/entradas', this.entrada.slug]);
    } else {
      this.router.navigate(['/entradas']);
    }
  }

  onSubmit() {
    this.save.emit(this.entrada);
  }
}