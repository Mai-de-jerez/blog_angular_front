import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response'; 

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Usamos inject() para un estilo más limpio y moderno
  private readonly http = inject(HttpClient);
  
  // URL de mi backend de Java 
  private readonly URL_API = 'http://localhost:8080/Blog/api/auth'; 

  /**
   * Envía las credenciales al backend. 
   * Retorna un Observable con la estructura de tu interfaz.
   */
  public isLogged = signal<boolean>(!!localStorage.getItem('token'));

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL_API}/login`, credentials).pipe(
      tap(response => {
        // Si el login es correcto, guardamos token y actualizamos el estado
        this.saveToken(response.token);
        this.isLogged.set(true);
      })
    );
  }

  // Método para guardar el token después del login exitoso
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Método para obtener el token cuando lo necesites
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear(); // Borra todo el localStorage, incluyendo el token
    this.isLogged.set(false); // Notifica a la Navbar instantáneamente
  }
}