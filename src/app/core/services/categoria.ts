import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';
import { environment } from '../../../environments/environment';
import { Pagina } from '../models/pagina';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService { 

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  // --- ESTADO DE FILTROS Y PAGINACIÓN CON SIGNALS ---
  idFiltro = signal<number | null>(null);
  nombreFiltro = signal('');
  padreIdFiltro = signal<number | null>(null);
  c3VacioFiltro = signal('');
  paginaActual = signal(0);
  categoriasPagina = signal<Pagina<Categoria> | null>(null);

  // Computed para obtener un objeto con los filtros actuales
  filtros = computed(() => ({
    id: this.idFiltro() ?? undefined,
    c1: this.nombreFiltro(),
    c2: this.padreIdFiltro() ? this.padreIdFiltro()!.toString() : '', 
    c3: this.c3VacioFiltro()
  }));

  // Listado para administración con filtros y paginación
  listarAdmin(): Observable<Pagina<Categoria>> {
    const f = this.filtros();
    let params = new HttpParams()
      .set('page', this.paginaActual().toString())
      .set('size', '10');

    if (f.id) params = params.set('id', f.id.toString());
    if (f.c1) params = params.set('nombre', f.c1);
    if (f.c2 && f.c2.trim() !== '') {
      params = params.set('padreId', f.c2.trim());
    } 
    return this.http.get<Pagina<Categoria>>(`${this.apiUrl}/admin`, { params });
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  getCategoriaBySlug(slug: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/slug/${slug}`);
  }

  crearCategoria(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
