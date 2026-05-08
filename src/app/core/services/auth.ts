import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response'; 
import { Router } from '@angular/router';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Usamos inject() para un estilo más limpio y moderno
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toastService = inject(Toast);
  
  // URL de mi backend de Java 
  private readonly URL_API = 'http://localhost:8080/Blog/api/auth'; 

  /**
   * Envía las credenciales al backend. 
   * Retorna un Observable con la estructura de la interfaz AuthResponse.
   */
  public isLogged = signal<boolean>(!!sessionStorage.getItem('token'));

  private readonly rolGuardado = sessionStorage.getItem('rol');
  public userRol = signal<number | null>(this.rolGuardado ? Number(this.rolGuardado) : null);
  private readonly idGuardado = sessionStorage.getItem('userId');
  public userId = signal<number | null>(this.idGuardado ? Number(this.idGuardado) : null);

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL_API}/login`, credentials).pipe(
      tap(response => {
        // Si el login es correcto, guardamos token y actualizamos el estado
        this.saveToken(response.token);
        sessionStorage.setItem('rol', response.rol.toString());
        sessionStorage.setItem('userId', response.id.toString());
        this.isLogged.set(true);
        this.userRol.set(response.rol);
        this.userId.set(response.id);
      })
    );
  }

  // Método para obtener el ID del usuario cuando lo necesites
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
    sessionStorage.setItem('token', token);
  }

  // Método para obtener el token cuando lo necesites
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout(): void {
    // Llamamos al backend para que invalide la sesión
    this.http.post(`${this.URL_API}/logout`, {}).subscribe({
      next: (res: any) => {
        //  capturamos mi mensaje de Java
        console.log('Backend dice:', res.mensaje); 
        if (res && res.mensaje) {
          this.toastService.mostrar(res.mensaje, 'success');
        }
      },
      error: (err) => {
        console.error('Error al cerrar sesión en servidor', err);
      },
      complete: () => {
        // 2. Cuando termine la comunicación, limpiamos y redirigimos
        sessionStorage.clear();
        this.isLogged.set(false);
        this.userRol.set(null);
        this.userId.set(null);
        this.router.navigate(['/login']);
      }
    });
  }
}