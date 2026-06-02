import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { CommonModule } from '@angular/common';
import { Filtro } from '../../../shared/components/filtro/filtro';
import { Paginador } from '../../../shared/components/paginador/paginador';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Toast } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-lista-usuarios',
  imports: [ CommonModule, ToastLocal, Filtro, Paginador ],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css', 
  standalone: true
})

export class ListaUsuarios implements OnInit {

  // inyección de servicios y variables
  readonly mediaUrl = environment.mediaUrl;
  private router = inject(Router);
  readonly usuarioService = inject(UsuarioService);
  private toast = inject(Toast);
  private authService = inject(Auth); 

  // variables para estado y borrado de usuarios
  cargando = signal(true);
  mostrarModal = signal(false);
  idAEliminar = signal<number | null>(null);

  // Getters para simplificar el acceso en el HTML
  get pagina() { return this.usuarioService.usuariosPagina; }
  get paginaActual() { return this.usuarioService.paginaActual; }
  public get auth() { return this.authService; }
 
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

  irACrear(): void {
    this.router.navigate(['/admin/usuarios/crear']);
  }

  irAVer(id: number) {
    this.router.navigate(['/admin/usuarios/detalle', id]);
  }

  // Método para eliminar usuarios
  eliminar(): void {
    if (!this.authService.isSuperAdmin()) {
      this.toast.mostrar('Acceso denegado: solo SuperAdministradores pueden borrar', 'error');
      this.mostrarModal.set(false);
      this.idAEliminar.set(null);
      return; 
    }
    const id = this.idAEliminar();
    if (!id) return;
    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.mostrarModal.set(false);
        this.idAEliminar.set(null);
        this.toast.mostrar('Usuario eliminado correctamente', 'success'); 
        this.cargar();
      },
      error: () => {
        this.mostrarModal.set(false);
        this.toast.mostrar('Error al eliminar el usuario', 'error'); 
      }
    });
  }

  // Métodos para eliminar usuarios
  confirmarEliminar(id: number): void {
    if (!this.authService.isSuperAdmin()) {
      this.toast.mostrar('No tienes permisos de SuperAdministrador para borrar', 'error');
      return; 
    }
    this.idAEliminar.set(id);
    this.mostrarModal.set(true);
  }

  cancelar(): void {
    this.mostrarModal.set(false);
    this.idAEliminar.set(null);
  }
}
