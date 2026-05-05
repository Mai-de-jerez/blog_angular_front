import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink], // Importamos FormsModule para usar ngModel
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Inyectamos las dependencias necesarias
  private authService = inject(Auth);
  private router = inject(Router);

  credentials = { username: '', password: '' };
  mensajeError: string | null = null;

  // Traducciones de errores basadas en mis códigos del backend
  private TRADUCCIONES_ERROR: { [codigo: string]: string } = {
    'PASSWORD_DEBIL': 'La contraseña es demasiado débil.',
    'CREDENCIALES_INCORRECTAS': 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.',
    'USERNAME_REQUERIDO': 'El nombre de usuario es obligatorio.',
    'PASSWORD_REQUERIDA': 'La contraseña es obligatoria.',
    // iré añadiendo más códigos y traducciones según los errores que me vayan llegando del backend
  };
  onLogin() {
    this.mensajeError = null;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Error del servidor:', err);
        
        // Pilla el código que viene en el JSON del Back
        const codigoError = err.error?.codigo;
        
        // Busca la traducción. Si no existe, pone un mensaje genérico.
        this.mensajeError = this.TRADUCCIONES_ERROR[codigoError] || 'Error inesperado al intentar entrar.';
      }
    });
  }
}
