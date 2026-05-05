import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  toastService = inject(Toast);

  credentials = { username: '', password: '' };
  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/admin']);
      }
    });
  }
}

