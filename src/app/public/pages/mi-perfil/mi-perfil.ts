import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { Usuario } from '../../../core/models/usuario';
import { UsuarioCard } from '../../../shared/components/usuario-card/usuario-card';
import { Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-mi-perfil',
  imports: [ UsuarioCard],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
  standalone: true
})

export class MiPerfil implements OnInit {

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private authService = inject(Auth);

  usuario = signal<Usuario | null>(null);
  cargando = signal(true);
  mostrarModal = signal(false);

  ngOnInit(): void {
    this.usuarioService.verPerfil().subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  confirmarBorrado(): void {
    this.mostrarModal.set(true);
  }

  cancelar(): void {
    this.mostrarModal.set(false);
  }

  borrarMiCuenta(): void {
    this.usuarioService.borrarCuenta().subscribe({
      next: () => {
        this.mostrarModal.set(false);
        this.authService.logoutLocal(); 
      },
      error: () => this.mostrarModal.set(false)
    });
  }

  volver(): void {
    this.router.navigate(['/']); 
  }
}