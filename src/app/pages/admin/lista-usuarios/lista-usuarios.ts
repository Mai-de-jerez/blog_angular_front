import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { Usuario } from '../../../core/models/usuario';
import { CommonModule } from '@angular/common';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-lista-usuarios',
  imports: [ CommonModule, ToastLocal ],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})

export class ListaUsuarios implements OnInit {

  // inyección de servicios y variables
  public mediaUrl = environment.mediaUrl; 
  public usuarioService = inject(UsuarioService);

  // variables para datos, estado y errores
  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  error = signal('');
 
  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: data => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar usuarios');
        this.cargando.set(false);
      }
    });
  }

}
