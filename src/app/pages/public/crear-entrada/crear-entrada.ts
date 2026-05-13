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
    if (!this.authService.isLogged()) {
      this.toastService.mostrar('Tu sesión ha expirado', 'error');
      this.router.navigate(['/login']);
      return;
    }
    const fd = new FormData();
    
    fd.append('titulo', datos.titulo || '');
    fd.append('contenido', datos.contenido || '');
    
    if (datos.categoriaId) {
      fd.append('categoriaId', datos.categoriaId.toString());
    }

    if (datos.imagenUrl instanceof File) {
      fd.append('imagen', datos.imagenUrl, datos.imagenUrl.name);
    }

    this.entradaService.crearEntrada(fd).subscribe({
      next: (res) => {
        this.toastService.mostrar('¡Entrada creada con éxito!', 'success');
        this.router.navigate(['/entradas', res.slug]);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        this.toastService.mostrar('Error al guardar la nueva entrada', 'error');
      } 
    });
  }
}