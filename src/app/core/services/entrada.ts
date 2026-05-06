import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrada } from '../models/entrada';


@Injectable({
  providedIn: 'root',
})

export class EntradaService {
  
  private readonly http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/Blog/api/entradas';

  getEntradas(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl);
  }

  getEntrada(id: number): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/${id}`);
  }

  getEntradaBySlug(slug: string): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/slug/${slug}`);
  }

  // Para el @POST
  crearEntrada(entrada: Partial<Entrada>): Observable<Entrada> {
    return this.http.post<Entrada>(this.apiUrl, entrada);
  }

  // Para el @PUT (El que necesitas ahora)
  updateEntrada(id: number, entrada: Partial<Entrada>): Observable<Entrada> {
    return this.http.put<Entrada>(`${this.apiUrl}/${id}`, entrada);
  }

  // Para el @DELETE
  deleteEntrada(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
