import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ToastLocal],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css'
})

export class CambiarPassword implements OnInit {
  private auth = inject(Auth);
  private toastService = inject(Toast);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pass1: string = '';
  pass2: string = '';
  token: string = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.toastService.mostrar('Enlace inválido o caducado', 'error');
      this.router.navigate(['/login']);
    }
  }

  onCambiar(): void {
    if (!this.pass1 || !this.pass2) {
      this.toastService.mostrar('Rellena los dos campos', 'error');
      return;
    }

    this.auth.cambiarPassword(this.token, this.pass1, this.pass2).subscribe({
      next: () => {
        this.toastService.mostrar('¡Contraseña cambiada! Ya puedes iniciar sesión', 'success');
        this.router.navigate(['/login']);
      }
    });
  }

}
