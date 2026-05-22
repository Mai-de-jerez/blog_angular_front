import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { LoginRequest } from '../../interfaces/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastLocal], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  credentials: LoginRequest = { username: '', password: '' };

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Redirección según el rol  
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']); 
        }
      },
      error: (err) => {
        console.error('Error en la autenticación', err);
      }
    });
  }
}





