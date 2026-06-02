import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrada } from '../models/entrada';
import { Pagina } from '../models/pagina';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class EntradaService {
  
  // inyección de HttpClient para llamadas a la API
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/entradas`;
  // Variables de estado para la entrada detallada 
  entradaDetalle = signal<Entrada | null>(null);

  // Variables de estado para la vista de administración
  idAdmin = signal<number | null>(null);
  tituloAdmin = signal('');
  categoriaAdmin = signal('');
  autorAdmin = signal('');
  paginaAdmin = signal(0);

  // Variables de estado para la vista pública
  tituloPublico = signal('');
  categoriaPublico = signal('');
  autorPublico = signal('');
  paginaPublico = signal(0);

  filtrosAdmin = computed(() => ({
    id: this.idAdmin() ?? undefined,
    c1: this.tituloAdmin(),
    c2: this.categoriaAdmin(),
    c3: this.autorAdmin()
  }));

  filtrosPublico = computed(() => ({
    c1: this.tituloPublico(),
    c2: this.categoriaPublico(),
    c3: this.autorPublico()
  }));
 
  // obtener entradas con filtros y paginación
  getEntradas(): Observable<Pagina<Entrada>> {
    const f = this.filtrosPublico();
    let params = new HttpParams()
      .set('page', this.paginaPublico())
      .set('size', '4');
    if (f.c1) params = params.set('titulo', f.c1);
    if (f.c2) params = params.set('categoria', f.c2);
    if (f.c3) params = params.set('autor', f.c3);
    return this.http.get<Pagina<Entrada>>(this.apiUrl, { params });
  }
  // obtener entradas para admin con filtros y paginación
  getEntradasAdmin(): Observable<Pagina<Entrada>> {
    const f = this.filtrosAdmin();
    let params = new HttpParams()
      .set('page', this.paginaAdmin())
      .set('size', '12');
    if (f.id) params = params.set('id', f.id.toString());
    if (f.c1) params = params.set('titulo', f.c1);
    if (f.c2) params = params.set('categoria', f.c2);
    if (f.c3) params = params.set('autor', f.c3);
    return this.http.get<Pagina<Entrada>>(`${this.apiUrl}/admin`, { params });
  }

  // obtener entrada por id para la vista de edición
  getEntrada(id: number): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/${id}`);
  }

  // obtener entrada por slug para la vista pública
  getEntradaBySlug(slug: string): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/slug/${slug}`);
  }

  // crear entrada desde el formulario de creación, con FormData para manejar la imagen
  crearEntrada(formData: FormData): Observable<Entrada> {
    return this.http.post<Entrada>(this.apiUrl, formData);
  }

  // actualizar entrada desde el formulario de edición, con FormData para manejar la imagen
  updateEntrada(id: number, formData: FormData): Observable<Entrada> {
    return this.http.put<Entrada>(`${this.apiUrl}/${id}`, formData);
  }

  // borrar entrada
  deleteEntrada(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  resetDetalle(): void {
    this.entradaDetalle.set(null);
  }
}
