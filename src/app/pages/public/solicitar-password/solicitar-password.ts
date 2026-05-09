import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth'; 
import { Toast } from '../../../core/services/toast'; 
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

@Component({
  selector: 'app-solicitar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ToastLocal ], 
  templateUrl: './solicitar-password.html',
  styleUrl: './solicitar-password.css'
})
export class SolicitarPassword {
  email: string = '';

  constructor(private authService: Auth, private toastService: Toast) {}

  onSolicitar() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!this.email || !emailRegex.test(this.email)) {
      this.toastService.mostrar('Introduce un email válido', 'error');
      return;
    }

    this.authService.solicitarRecuperacion(this.email).subscribe({
      next: () => {
        this.toastService.mostrar('¡Revisa tu bandeja de entrada!', 'success');
      },
      error: () => {
        this.toastService.mostrar('No se pudo enviar el email', 'error');
      }
    });
  }
}
