import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { CommonModule } from '@angular/common';
import { Filtro } from '../../../shared/components/filtro/filtro';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  imports: [ CommonModule, ToastLocal, Filtro, Paginador ],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css', 
  standalone: true
})

export class ListaUsuarios implements OnInit {

  // inyección de servicios y variables
  public mediaUrl = environment.mediaUrl; 
  public router = inject(Router);
  public usuarioService = inject(UsuarioService);

  // variables para estado y errores
  cargando = signal(true);

  // Getters para simplificar el acceso en el HTML
  get pagina() { return this.usuarioService.usuariosPagina; }
  get paginaActual() { return this.usuarioService.paginaActual; }
 
  // Método para cargar usuarios
  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarioService.usuariosPagina.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  onFiltro(filtros: any): void {
  this.usuarioService.idFiltro.set(filtros.id);
  this.usuarioService.usernameFiltro.set(filtros.c1);
  this.usuarioService.nombreFiltro.set(filtros.c2);
  this.usuarioService.apellidosFiltro.set(filtros.c3);  
  this.usuarioService.paginaActual.set(0); 
  this.cargar();
}

  onPage(page: number): void {
    this.usuarioService.paginaActual.set(page);
    this.cargar();
  }

  irAEditar(id: number): void {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }
}
