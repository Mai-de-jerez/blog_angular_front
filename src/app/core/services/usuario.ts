import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class UsuarioService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/usuarios`; 
  private readonly perfilUrl = `${environment.apiUrl}/perfil`;

  // Administración de usuarios
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
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