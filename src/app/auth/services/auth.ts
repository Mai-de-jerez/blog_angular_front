import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { AuthResponse } from '../../auth/interfaces/auth-response'; 
import { LoginRequest } from '../../auth/interfaces/login-request';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Toast } from '../../core/services/toast';

@Injectable({
  providedIn: 'root' 
})
export class Auth {
  // inyectamos los servicios necesarios
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toastService = inject(Toast); 
  private readonly URL_API = `${environment.apiUrl}/auth`;

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
  isAdmin = computed(() => this.userRol() === 1 || this.userRol() === 2);
  isSuperAdmin = computed(() => this.userRol() === 1);

  // Método para inicializar la autenticación al cargar la aplicación
  initAuth(): Observable<any> {
    const token = this.getTokenFromStorage();

    if (!token) {
      return of(null);
    }

    return this.checkToken();
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

  // Método para guardar el token después del login exitoso
  saveToken(token: string): void {
    this.setTokenStorage(token);
  }

  // Método para obtener el token cuando lo necesites
  getToken(): string | null {
    return this.getTokenFromStorage();
  }

  // Método para cerrar sesión localmente sin llamar a la API
  get logoutLocal() {
    return () => this.limpiarSesionLocal();
  }

  // LLAMADAS A LA API

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

  // Método para iniciar sesión
  login(credentials: LoginRequest): Observable<AuthResponse> {
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

  // Método para registrar un nuevo usuario
  registro(datos: any): Observable<any> {
    return this.http.post(`${this.URL_API}/registro`, datos);
  }

  // Método para cerrar sesión llamando a la API y limpiando la sesión local
  logout(): void {
    this.http.post(`${this.URL_API}/logout`, {}).subscribe({
      next: (res: any) => {
        const mensajeBackend = res && res.mensaje ? res.mensaje : 'Sesión cerrada exitosamente';
        
        // 1. Limpiamos el almacenamiento viejo
        this.clearStorage();
        
        // 2. Guardamos el mensaje en el disco para el Login
        sessionStorage.setItem('flash_toast_msg', mensajeBackend);
        
        // Recarga inmediata. Al cargar el Login, su ngOnInit leerá el disco y pintará el mensaje de exito del back.
        window.location.href = '/login';
      },
      error: () => {
        this.clearStorage();
        window.location.href = '/login';
      }
    });
  }


  // Método para solicitar recuperación de contraseña
  solicitarRecuperacion(email: string): Observable<any> {
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
}