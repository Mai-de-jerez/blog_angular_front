import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models/usuario';
import { Auth } from '../../../auth/services/auth';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastLocal } from '../toast-local/toast-local';

@Component({
  selector: 'app-usuario-card',
  imports: [CommonModule, ToastLocal],
  templateUrl: './usuario-card.html',
  styleUrl: './usuario-card.css',
  standalone: true
})
export class UsuarioCard {

  usuario = input.required<Usuario>();
  mostrarId = input(false);
  alVolver = output<void>();
  alBorrar = output<void>();


  authService = inject(Auth);
  router = inject(Router);
  mediaUrl = environment.mediaUrl;

  get esPropioPerfil(): boolean {
    return this.authService.getUsuarioId() === this.usuario().id;
  }

  get esSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  irAEditar(): void {
    if (this.esPropioPerfil) {
      this.router.navigate(['/mi-perfil/editar']);
    } else {
      this.router.navigate(['/admin/usuarios/editar', this.usuario().id]);
    }
  }

  volver(): void {
    this.alVolver.emit();
  }

  borrar(): void {
    this.alBorrar.emit();
  }
}
