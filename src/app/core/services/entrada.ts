import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
  categoriaFooter$ = new BehaviorSubject<string>('');
 
  // obtener entradas con filtros y paginación
  getEntradas(titulo: string, categoria: string, autor: string, pagina: number) {
    let params = new HttpParams().set('page', pagina).set('size', '4');
    if (titulo) params = params.set('titulo', titulo);
    if (categoria) params = params.set('categoria', categoria);
    if (autor) params = params.set('autor', autor);
    return this.http.get<Pagina<Entrada>>(this.apiUrl, { params });
  }

  // obtener entradas para admin con filtros y paginación
  getEntradasAdmin(id: number | null, titulo: string, categoria: string, autor: string, pagina: number): Observable<Pagina<Entrada>> {
  let params = new HttpParams().set('page', pagina).set('size', '12');
  if (id) params = params.set('id', id);
  if (titulo) params = params.set('titulo', titulo);
  if (categoria) params = params.set('categoria', categoria);
  if (autor) params = params.set('autor', autor);
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
