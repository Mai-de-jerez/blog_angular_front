import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService { 

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

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
