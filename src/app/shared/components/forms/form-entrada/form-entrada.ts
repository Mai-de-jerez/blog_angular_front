import { Component, ChangeDetectorRef, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Entrada } from '../../../../core/models/entrada';
import { CategoriaService } from '../../../../core/services/categoria';
import { Categoria } from '../../../../core/models/categoria';

interface CategoriaSelectGroup {
  label: string;
  data: number;
  groupLabel: string;
}

@Component({
  selector: 'app-form-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './form-entrada.html',
  styleUrl: './form-entrada.css'
})
export class FormEntrada implements OnInit {
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private _entrada: Partial<Entrada> = {};

  @Input() set entrada(val: Partial<Entrada>) {
    this._entrada = {
      ...val,
      categoriaId: val.categoriaId ? Number(val.categoriaId) : undefined
    };
    this.cdr.detectChanges();
  }
  get entrada() { return this._entrada; }

  @Output() save = new EventEmitter<Partial<Entrada>>();

  categoriasParaSelect: CategoriaSelectGroup[] = [];

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categoriasParaSelect = this.formatearParaSelect(categorias);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  private formatearParaSelect(lista: Categoria[]): CategoriaSelectGroup[] {
    const result: CategoriaSelectGroup[] = [];
    const padres = lista.filter(c => !c.padreId);

    for (const padre of padres) {
      result.push({ label: padre.nombre, data: Number(padre.id), groupLabel: padre.nombre });

      const hijos = lista.filter(c => c.padreId === padre.id);
      for (const hijo of hijos) {
        result.push({ label: hijo.nombre, data: Number(hijo.id), groupLabel: padre.nombre });

        const nietos = lista.filter(c => c.padreId === hijo.id);
        for (const nieto of nietos) {
          result.push({ label: nieto.nombre, data: Number(nieto.id), groupLabel: hijo.nombre });
        }
      }
    }
    return result;
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


