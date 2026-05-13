import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrada } from '../models/entrada';
import { Pagina } from '../models/pagina';


@Injectable({
  providedIn: 'root',
})

export class EntradaService {
  
  private readonly http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/Blog/api/entradas';

  getEntradas(titulo?: string, categoria?: string, autor?: string, page: number = 0): Observable<Pagina<Entrada>> {
    let params = new HttpParams().set('page', page);
    if (titulo)    params = params.set('titulo', titulo);
    if (categoria) params = params.set('categoria', categoria);
    if (autor)     params = params.set('autor', autor);
    
    return this.http.get<Pagina<Entrada>>(this.apiUrl, { params });
  }

  getEntrada(id: number): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/${id}`);
  }

  getEntradaBySlug(slug: string): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/slug/${slug}`);
  }

  // Para el @POST
  // crearEntrada(entrada: Partial<Entrada>): Observable<Entrada> {
  //   return this.http.post<Entrada>(this.apiUrl, entrada);
  // }

  // Para el @PUT (El que necesitas ahora)
  // updateEntrada(id: number, entrada: Partial<Entrada>): Observable<Entrada> {
  //   return this.http.put<Entrada>(`${this.apiUrl}/${id}`, entrada);
  // }

  // Métodos con FormData para manejar archivos (imagen)
  crearEntrada(formData: FormData): Observable<Entrada> {
    return this.http.post<Entrada>(this.apiUrl, formData);
  }

  // actualizarEntrada con FormData para manejar archivos
  updateEntrada(id: number, formData: FormData): Observable<Entrada> {
    return this.http.put<Entrada>(`${this.apiUrl}/${id}`, formData);
  }

  // Para el @DELETE
  deleteEntrada(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
