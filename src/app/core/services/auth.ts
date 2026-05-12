import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { AuthResponse } from '../models/auth-response'; 
import { Router } from '@angular/router';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // inyectamos los servicios necesarios
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toastService = inject(Toast); 
  private readonly URL_API = 'http://localhost:8080/Blog/api/auth'; 

  // métodos para manejar el token en sessionStorage
  private getTokenFromStorage(): string | null {
    return sessionStorage.getItem('token');
  }

  private setTokenStorage(token: string): void {
    sessionStorage.setItem('token', token); 
  }

  private clearStorage(): void {
    sessionStorage.clear(); 
  }

  // Señales para manejar el estado de autenticación y el rol del usuario
  public isLogged = signal<boolean>(false);
  public userRol = signal<number | null>(null);
  public userId = signal<number | null>(null);

  // Método para inicializar la autenticación al cargar la aplicación
  initAuth(): Observable<any> {
    const token = this.getTokenFromStorage();

    if (!token) {
      return of(null);
    }

    return this.checkToken();
  }

  // Método para iniciar sesión
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL_API}/login`, credentials).pipe(
      tap(response => {
        // Si el login es correcto, guardamos token y actualizamos el estado
        this.setTokenStorage(response.token);
        this.isLogged.set(true);
        this.userRol.set(response.rol);
        this.userId.set(response.id);
      })
    );
  }

  // Método para verificar el token al cargar la aplicación
  checkToken(): Observable<any> {
    return this.http.get<any>(`${this.URL_API}/check`).pipe(
      tap({
        next: (res) => {
          this.isLogged.set(true);
          this.userRol.set(res.nivel);
          this.userId.set(res.id);
        },
        error: () => {
          this.limpiarSesionLocal(); 
        }
      })
    );
  }

  // Método privado para limpiar la sesión local y redirigir al login
  private limpiarSesionLocal(): void {
    this.clearStorage();
    this.isLogged.set(false);
    this.userRol.set(null);
    this.userId.set(null);
    this.router.navigate(['/login']);
  }

  // Método para obtener el ID del usuario
  getUsuarioId(): number | null {
    return this.userId();
  }

  // Método para verificar si el usuario tiene rol de admin
  isAdmin(): boolean {
    const rol = this.userRol();
    return rol === 1 || rol === 2; 
  }

  // Método para verificar si el usuario tiene rol de super admin
  isSuperAdmin(): boolean {
    return this.userRol() === 1;
  }

  // Método para guardar el token después del login exitoso
  saveToken(token: string): void {
    this.setTokenStorage(token);
  }

    // Método para obtener el token cuando lo necesites
  getToken(): string | null {
    return this.getTokenFromStorage();
  }

  // Método para cerrar sesión
  logout(): void {
    this.http.post(`${this.URL_API}/logout`, {}).subscribe({
      next: (res: any) => {
        if (res && res.mensaje) {
          this.toastService.mostrar(res.mensaje, 'success');
        }
      },
      error: (err) => {
        console.error('Error al cerrar sesión en servidor', err);
      },
      complete: () => {
        this.limpiarSesionLocal();
      }
    });
  }


  // Método para solicitar recuperación de contraseña
  solicitarRecuperacion(email: string): Observable<any> {
    // Enviamos un objeto que Java recibirá como un Map<String, String>
    return this.http.post(`${this.URL_API}/solicitar-recuperacion`, { email });
  }

  // Método para cambiar la contraseña
  cambiarPassword(token: string, pass1: string, pass2: string): Observable<any> {
    return this.http.post(`${this.URL_API}/cambiar-password`, { 
      token, 
      pass1, 
      pass2 
    });
  }

  // Método para registrar un nuevo usuario
  registro(datos: any): Observable<any> {
    return this.http.post(`${this.URL_API}/registro`, datos);
  }
  
}