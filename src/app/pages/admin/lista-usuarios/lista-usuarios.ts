import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { Usuario } from '../../../core/models/usuario';
import { CommonModule } from '@angular/common';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

@Component({
  selector: 'app-lista-usuarios',
  imports: [ CommonModule, ToastLocal ],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})

export class ListaUsuarios implements OnInit {

  public usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);
  usuarios: Usuario[] = [];
  cargando = true;
  error = '';
 
  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: data => {
        this.usuarios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar usuarios';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

}
