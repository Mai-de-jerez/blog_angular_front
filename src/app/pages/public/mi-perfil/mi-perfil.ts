import { Component, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { Usuario } from '../../../core/models/usuario';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mi-perfil',
  imports: [ ToastLocal , CommonModule ], 
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {

  public readonly mediaUrl = environment.mediaUrl;

  usuario = signal<Usuario | null>(null);
  cargando = signal(true);
  error = signal('');

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.verPerfil().subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }
}