import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Comentario } from '../models/comentario';
import { ComentarioPost } from '../models/comentario-post';
import { Pagina } from '../models/pagina';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comentarios`;

  // --- ESTADO ---
  comentarios = signal<Comentario[]>([]);
  cargando = signal(false);
  enviando = signal(false);
  paginaActual = signal(0);
  totalPaginas = signal(0);
  respondendoA = signal<number | null>(null);
  editandoId = signal<number | null>(null);
  textoNuevo = signal('');
  textoRespuesta = signal('');
  textoEditando = signal('');
  padreActivo = signal<number | null>(null);
  readonly size = 10; // Comentarios por página

  // --- ÁRBOL: comentario activo como padre ---
  verRespuestas(id: number): void {
    this.padreActivo.set(id);
  }

  volverAlPadre(comentario: Comentario): void {
    // Si el comentario tiene padre, subimos a su padre; si no, volvemos a la raíz
    this.padreActivo.set(comentario.entradaId ? null : null);
  }

  volverARaiz(): void {
    this.padreActivo.set(null);
  }

  // Devuelve el comentario activo como padre (o null si estamos en raíz)
  getComentarioPadreActivo(): Comentario | null {
    const id = this.padreActivo();
    if (id === null) return null;
    return this.buscarComentarioEnArbol(this.comentarios(), id);
  }

  private buscarComentarioEnArbol(lista: Comentario[], id: number): Comentario | null {
    for (const c of lista) {
      if (c.id === id) return c;
      if (c.respuestas?.length) {
        const encontrado = this.buscarComentarioEnArbol(c.respuestas, id);
        if (encontrado) return encontrado;
      }
    }
    return null;
  }

  // --- LECTURA ---
  getComentariosPorEntrada(entradaId: number): Observable<Pagina<Comentario>> {
    const params = new HttpParams()
      .set('page', this.paginaActual())
      .set('size', this.size);
    return this.http.get<Pagina<Comentario>>(`${this.apiUrl}/entrada/${entradaId}`, { params }).pipe(
      catchError(() => of({ contenido: [], paginaActual: 0, totalPaginas: 0, totalElementos: 0 }))
    );
  }

  getComentariosPorUsuario(usuarioId: number, page: number = 0, size: number = 10): Observable<Pagina<Comentario>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<Pagina<Comentario>>(`${this.apiUrl}/usuario/${usuarioId}`, { params });
  }

  getComentario(id: number): Observable<Comentario> {
    return this.http.get<Comentario>(`${this.apiUrl}/${id}`);
  }

  // --- ESCRITURA ---
  crearComentario(entradaId: number, dto: ComentarioPost): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.apiUrl}/entrada/${entradaId}`, dto);
  }

  editarComentario(id: number, dto: ComentarioPost): Observable<Comentario> {
    return this.http.put<Comentario>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarComentario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- RESET ---
  resetEstado(): void {
    this.comentarios.set([]);
    this.cargando.set(false);
    this.enviando.set(false);
    this.paginaActual.set(0);
    this.totalPaginas.set(0);
    this.respondendoA.set(null);
    this.editandoId.set(null);
    this.textoNuevo.set('');
    this.textoRespuesta.set('');
    this.textoEditando.set('');
    this.padreActivo.set(null);
  }
}