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

  onLogin() {
    console.log('Intentando entrar con:', this.credentials);
    
    // Llamamos al método login del servicio
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('¡Éxito!', response);
        
        // Guardamos el token en el almacenamiento local
        localStorage.setItem('token', response.token);
        
        // Redirigimos a la página de administración
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        // Si el backend devuelve un 401 o 403, saltará por aquí
        console.error('Error en el login:', err);
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}