import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario';
import { ComentarioPost } from '../models/comentario-post';
import { Pagina } from '../models/pagina';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comentarios`;

  // --- LECTURA ---

  // Comentarios raíz de una entrada (padre = null), paginados de 10 en 10
  getComentariosPorEntrada(entradaId: number, page: number, size: number = 10): Observable<Pagina<Comentario>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<Pagina<Comentario>>(`${this.apiUrl}/entrada/${entradaId}`, { params });
  }

  // Respuestas de un comentario padre, paginadas de 5 en 5
  getRespuestasPorPadre(padreId: number, page: number, size: number = 5): Observable<Pagina<Comentario>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<Pagina<Comentario>>(`${this.apiUrl}/padre/${padreId}`, { params });
  }

  // Comentarios de un usuario (requiere auth)
  getComentariosPorUsuario(usuarioId: number, page: number, size: number = 10): Observable<Pagina<Comentario>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<Pagina<Comentario>>(`${this.apiUrl}/usuario/${usuarioId}`, { params });
  }

  // --- ESCRITURA ---

  // Crear comentario raíz o respuesta (comentarioPadreId = null si es raíz)
  crearComentario(entradaId: number, dto: ComentarioPost): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.apiUrl}/entrada/${entradaId}`, dto);
  }

  // Editar comentario propio (o admin)
  editarComentario(id: number, dto: ComentarioPost): Observable<Comentario> {
    return this.http.put<Comentario>(`${this.apiUrl}/${id}`, dto);
  }

  // Borrar comentario propio (o admin)
  borrarComentario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}