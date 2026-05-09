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
  password2 = '';

  datos = {
    username: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    foto: '',
    rol: null
  };

  onRegistro(): void {
    if (this.datos.password !== this.password2) {
      this.toastService.mostrar('Las contraseñas no coinciden', 'error');
      return;
    }

    this.cargando = true;

    this.authService.registro(this.datos).subscribe({
      next: () => {
        this.toastService.mostrar('Registro completado. ¡Ya puedes iniciar sesión!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err?.error?.codigo ?? 'Error al registrarse';
        this.toastService.mostrar(msg, 'error');
        this.cargando = false;
      }
    });
  }
}

