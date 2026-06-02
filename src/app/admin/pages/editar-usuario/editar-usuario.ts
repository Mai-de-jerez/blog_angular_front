import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario';
import { FormUsuario } from '../../../shared/components/forms/form-usuario/form-usuario';
import { Usuario } from '../../../core/models/usuario';
import { Toast } from '../../../core/services/toast';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-editar-usuario',
  imports: [CommonModule, FormUsuario],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
  standalone: true
})
export class EditarUsuario implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(Toast);
  public auth = inject(Auth);

  usuarioCargado = signal<Usuario | null>(null);

  ngOnInit(): void {
    if (!this.auth.isSuperAdmin()) {
      this.toastService.mostrar('Acceso denegado: solo SuperAdministradores', 'error');
      this.router.navigate(['/admin/usuarios']);
      return;
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.usuarioService.buscar(id).subscribe({
        next: (res) => this.usuarioCargado.set(res),
        error: () => {
          this.toastService.mostrar('No se ha podido cargar el usuario', 'error');
          this.router.navigate(['/admin/usuarios']);
        }
      });
    }
  }

  actualizar(datos: any): void {
    if (!this.auth.isSuperAdmin()) {
      this.toastService.mostrar('Acceso denegado', 'error');
      return;
    }
    const usuario = this.usuarioCargado();
    if (usuario?.id) {
      const fd = new FormData();
      fd.append('username', datos.username);
      fd.append('nombre', datos.nombre);
      fd.append('apellidos', datos.apellidos);
      fd.append('email', datos.email);
      fd.append('telefono', datos.telefono ?? '');
      fd.append('direccion', datos.direccion ?? '');
      if (datos.rol) fd.append('rol', datos.rol);
      if (datos.pass1) fd.append('pass1', datos.pass1);
      if (datos.pass2) fd.append('pass2', datos.pass2);
      if (datos.foto instanceof File) fd.append('foto', datos.foto, datos.foto.name);

      this.usuarioService.actualizar(usuario.id, fd).subscribe({
        next: () => {
          this.toastService.mostrar('Usuario actualizado con éxito', 'success');
          this.router.navigate(['/admin/usuarios']);
        }
      });
    }
  }
}