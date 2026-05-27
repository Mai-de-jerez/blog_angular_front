import { Component, inject, OnInit, signal } from '@angular/core';
import { EntradaService } from '../../../core/services/entrada';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { FormEntrada } from '../../../shared/components/forms/form-entrada/form-entrada';
import { Entrada } from '../../../core/models/entrada';

@Component({
  selector: 'app-editar-entrada',
  imports: [CommonModule, FormEntrada, ToastLocal],
  templateUrl: './editar-entrada.html',
  styleUrl: './editar-entrada.css',
  standalone: true
})
export class EditarEntrada implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entradaService = inject(EntradaService);
  private toastService = inject(Toast);

  entradaCargada = signal<Entrada | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.entradaService.getEntrada(id).subscribe({
        next: (res) => this.entradaCargada.set(res),
        error: () => {
          this.toastService.mostrar('No se ha podido cargar la entrada', 'error');
          this.router.navigate(['/admin/entradas']);
        }
      });
    }
  }

  actualizar(datos: any): void {
    const entrada = this.entradaCargada();
    if (entrada?.id) {
      const fd = new FormData();
      fd.append('titulo', datos.titulo);
      fd.append('contenido', datos.contenido);
      if (datos.categoriaId) fd.append('categoriaId', datos.categoriaId.toString());
      if (datos.imagenUrl instanceof File) fd.append('imagen', datos.imagenUrl, datos.imagenUrl.name);

      this.entradaService.updateEntrada(entrada.id, fd).subscribe({
        next: () => {
          this.toastService.mostrar('¡Entrada actualizada con éxito!', 'success');
          this.router.navigate(['/admin/entradas']);  
        },
        error: (err) =>  {
          console.error('Error al crear:', err);
          this.toastService.mostrar('Error al actualizar la entrada', 'error')    
        }          
      }); 
    } 
  }

  volverAlListadoAdmin(): void {
    this.router.navigate(['/admin/entradas']); 
  }
}

