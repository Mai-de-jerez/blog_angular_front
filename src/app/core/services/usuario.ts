import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Pagina } from '../models/pagina';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class UsuarioService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/usuarios`; 
  private readonly perfilUrl = `${environment.apiUrl}/perfil`;

  // --- ESTADO DE FILTROS Y PAGINACIÓN ---
  idFiltro = signal<number | null>(null);
  usernameFiltro = signal('');
  nombreFiltro = signal('');
  apellidosFiltro = signal('');  
  paginaActual = signal(0);
  usuariosPagina = signal<Pagina<Usuario> | null>(null);

  // Computed para obtener un objeto con los filtros actuales
  filtros = computed(() => ({
    id: this.idFiltro() ?? undefined,
    c1: this.usernameFiltro(),
    c2: this.nombreFiltro(),
    c3: this.apellidosFiltro()
  }));

  listar(): Observable<Pagina<Usuario>> {
    const f = this.filtros();
    let params = new HttpParams()
      .set('page', this.paginaActual())
      .set('size', '12');

    if (f.id)  params = params.set('id', f.id.toString());
    if (f.c1)  params = params.set('username', f.c1);
    if (f.c2)  params = params.set('nombre', f.c2);
    if (f.c3)  params = params.set('apellidos', f.c3);

    return this.http.get<Pagina<Usuario>>(this.url, { params });
  }

  buscar(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  crear(form: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, form);
  }

  actualizar(id: number, form: FormData): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, form);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Perfil propio
  verPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(this.perfilUrl);
  }

  editarPerfil(form: FormData): Observable<Usuario> {
    return this.http.put<Usuario>(this.perfilUrl, form);
  }

  borrarCuenta(): Observable<void> {
    return this.http.delete<void>(this.perfilUrl);
  }
}