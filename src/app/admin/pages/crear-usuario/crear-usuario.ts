import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario'; 
import { Toast } from '../../../core/services/toast';
import { FormUsuario } from '../../../shared/components/forms/form-usuario/form-usuario'; 
import { Auth } from '../../../auth/services/auth';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [FormUsuario, ToastLocal], 
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.css'
})

export class CrearUsuario {
  private readonly usuarioService = inject(UsuarioService);
  private readonly toastService = inject(Toast);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  cargando = signal<boolean>(false);

  procesarCreacion(datos: any): void {
    if (!this.auth.isSuperAdmin()) {
      this.toastService.mostrar('No tienes permisos para esta acción', 'error');
      return;
    }
    this.cargando.set(true);

    const form = new FormData();
    if (datos.username) form.append('username', datos.username);
    if (datos.nombre) form.append('nombre', datos.nombre);
    if (datos.apellidos) form.append('apellidos', datos.apellidos);
    if (datos.email) form.append('email', datos.email);
    if (datos.pass1) form.append('pass1', datos.pass1);
    if (datos.pass2) form.append('pass2', datos.pass2);
    if (datos.telefono) form.append('telefono', datos.telefono);
    if (datos.direccion) form.append('direccion', datos.direccion);
    
    // Campo exclusivo de administración:
    if (datos.rol) form.append('rol', datos.rol);
    
    if (datos.foto instanceof File) {
      form.append('foto', datos.foto, datos.foto.name);
    }

    this.usuarioService.crear(form).subscribe({
      next: () => {
        this.toastService.mostrar('Usuario creado correctamente', 'success');
        this.router.navigate(['/admin/usuarios']); 
      },
      error: () => { 
        this.cargando.set(false); 
      }
    });
  }
}
