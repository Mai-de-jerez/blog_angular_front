import { Injectable, inject, signal } from '@angular/core';
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
  // Variables de estado para la vista pública
  pagina = signal<Pagina<Entrada> | null>(null);
  titulo = signal('');
  categoria = signal('');
  autor = signal('');
  paginaActual = signal(0);
  // Variables de estado para la vista de administración
  idAdmin = signal<number | null>(null);
  tituloAdmin = signal('');
  categoriaAdmin = signal('');
  autorAdmin = signal('');
  paginaAdminData = signal<Pagina<Entrada> | null>(null);
  paginaActualAdmin = signal(0);
 
  // obtener entradas con filtros y paginación
  getEntradas() {
    let params = new HttpParams().set('page', this.paginaActual()).set('size', '4');
    if (this.titulo())    params = params.set('titulo', this.titulo());
    if (this.categoria()) params = params.set('categoria', this.categoria());
    if (this.autor())     params = params.set('autor', this.autor());
    return this.http.get<Pagina<Entrada>>(this.apiUrl, { params });
  }

  // obtener entradas para administración con filtros y paginación
  getEntradasAdmin(): Observable<Pagina<Entrada>> {
    let params = new HttpParams().set('page', this.paginaActualAdmin()).set('size', '12'); 
    if (this.idAdmin())        params = params.set('id', this.idAdmin()!);
    if (this.tituloAdmin())    params = params.set('titulo', this.tituloAdmin());
    if (this.categoriaAdmin()) params = params.set('categoria', this.categoriaAdmin());
    if (this.autorAdmin())     params = params.set('autor', this.autorAdmin());
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
