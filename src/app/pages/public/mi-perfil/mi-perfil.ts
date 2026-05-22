import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { Usuario } from '../../../core/models/usuario';
import { UsuarioCard } from '../../../shared/components/usuario-card/usuario-card';

@Component({
  selector: 'app-mi-perfil',
  imports: [ UsuarioCard],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
  standalone: true
})

export class MiPerfil implements OnInit {

  private usuarioService = inject(UsuarioService);

  usuario = signal<Usuario | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    this.usuarioService.verPerfil().subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}