import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario';
import { FormUsuario } from '../../../shared/components/forms/form-usuario/form-usuario';
import { Usuario } from '../../../core/models/usuario';
import { Toast } from '../../../core/services/toast';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-editar-perfil',
  imports: [FormUsuario],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.css',
  standalone: true
})
export class EditarPerfil implements OnInit {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(Toast);
  private auth = inject(Auth);

  usuarioCargado = signal<Usuario | null>(null);
  idUsuario = this.auth.getUsuarioId();

  ngOnInit(): void {
    this.usuarioService.verPerfil().subscribe({
      next: (res) => this.usuarioCargado.set(res),
      error: () => {
        this.toastService.mostrar('No se ha podido cargar el perfil', 'error');
        this.router.navigate(['/mi-perfil']);
      }
    });
  }

  actualizar(datos: any): void {
    const fd = new FormData();
    fd.append('username', datos.username);
    fd.append('nombre', datos.nombre);
    fd.append('apellidos', datos.apellidos);
    fd.append('email', datos.email);
    fd.append('telefono', datos.telefono ?? '');
    fd.append('direccion', datos.direccion ?? '');
    if (datos.pass1) fd.append('pass1', datos.pass1);
    if (datos.pass2) fd.append('pass2', datos.pass2);
    if (datos.foto instanceof File) fd.append('foto', datos.foto, datos.foto.name);

    this.usuarioService.editarPerfil(fd).subscribe({
      next: () => {
        this.toastService.mostrar('Perfil actualizado con éxito', 'success');
        this.router.navigate(['/mi-perfil']);
      }
    });
  }
}
