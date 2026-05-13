import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})

export class UsuarioService {

  private url = 'http://localhost:8080/Blog/api/usuarios';

  constructor(private http: HttpClient) {}

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
}