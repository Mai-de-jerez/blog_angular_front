import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { FormUsuario } from '../../../shared/components/forms/form-usuario/form-usuario'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ FormUsuario], 
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private readonly authService = inject(Auth);
  private readonly toastService = inject(Toast);
  private readonly router = inject(Router);

  cargando = signal<boolean>(false);

  procesarRegistro(datos: any): void {
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
    
    if (datos.foto instanceof File) {
      form.append('foto', datos.foto, datos.foto.name);
    }

    this.authService.registro(form).subscribe({
      next: () => {
        this.toastService.mostrar('Registro completado. ¡Ya puedes iniciar sesión!', 'success');
        this.router.navigate(['/login']);
      },
      error: () => { 
        this.cargando.set(false); 
      }
    });
  }
}
