import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastLocal],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  private readonly authService = inject(Auth);
  private readonly toastService = inject(Toast);
  private readonly router = inject(Router);

  cargando = false;
  fotoArchivo: File | null = null;

  datos = {
    username: '',
    nombre: '',
    apellidos: '',
    email: '',
    pass1: '',
    pass2: '',
    telefono: '',
    direccion: ''
  };

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fotoArchivo = input.files[0];
    }
  }

  onRegistro(): void {
    if (this.datos.pass1 !== this.datos.pass2) {
      this.toastService.mostrar('Las contraseñas no coinciden', 'error');
      return;
    }

    this.cargando = true;

    const form = new FormData();
    form.append('username', this.datos.username);
    form.append('nombre', this.datos.nombre);
    form.append('apellidos', this.datos.apellidos);
    form.append('email', this.datos.email);
    form.append('pass1', this.datos.pass1);
    form.append('pass2', this.datos.pass2);
    form.append('telefono', this.datos.telefono);
    form.append('direccion', this.datos.direccion);
    if (this.fotoArchivo) form.append('foto', this.fotoArchivo);

    this.authService.registro(form).subscribe({
      next: () => {
        this.toastService.mostrar('Registro completado. ¡Ya puedes iniciar sesión!', 'success');
        this.router.navigate(['/login']);
      },
      error: () => { this.cargando = false; }
    });
  }
}

