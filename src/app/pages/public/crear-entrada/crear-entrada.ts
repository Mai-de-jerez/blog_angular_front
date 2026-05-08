import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { FormEntrada } from '../../../shared/components/forms/form-entrada/form-entrada';
import { Entrada } from '../../../core/models/entrada';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-crear-entrada',
  standalone: true,
  imports: [CommonModule, FormEntrada, ToastLocal],
  templateUrl: './crear-entrada.html',
  styleUrl: './crear-entrada.css',
})

export class CrearEntrada {
  private router = inject(Router);
  private entradaService = inject(EntradaService);
  private toastService = inject(Toast);
 private authService = inject(Auth);

  // Inicializamos el objeto vacío para que el formulario no de errores
  nuevaEntrada: Partial<Entrada> = {
    titulo: '',
    contenido: '',
    imagenUrl: '',
    categoriaId: undefined
  };

  crear(datos: Partial<Entrada>): void {
    // por si le caduca el token mientras escribe al hijo de la gran puta
      if (!this.authService.isLogged()) {
      this.toastService.mostrar('Tu sesión ha expirado', 'error');
      this.router.navigate(['/login']);
      return;
    }
    // Castamos a Entrada porque el servicio espera el modelo completo
    this.entradaService.crearEntrada(datos as Entrada).subscribe({
      next: (res) => {
        this.toastService.mostrar('¡Entrada creada con éxito!', 'success');
        // Redirigimos al detalle de la nueva entrada usando el slug que nos devuelva el backend
        this.router.navigate(['/entradas', res.slug]);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        this.toastService.mostrar('Error al guardar la nueva entrada', 'error');
      } 
    });
  }
}