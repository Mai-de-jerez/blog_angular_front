import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { LoginRequest } from '../../interfaces/login-request';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastLocal], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  private toastService = inject(Toast);

  credentials: LoginRequest = { username: '', password: '' };

  ngOnInit(): void {
    const mensajePendiente = sessionStorage.getItem('flash_toast_msg');

    if (mensajePendiente) {
      this.toastService.mostrar(mensajePendiente, 'success');
      sessionStorage.removeItem('flash_toast_msg');
    }
  }

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





