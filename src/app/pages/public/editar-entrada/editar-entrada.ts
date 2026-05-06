import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { FormEntrada } from '../../../shared/components/forms/form-entrada/form-entrada';
import { Entrada } from '../../../core/models/entrada';
import { Toast } from '../../../core/services/toast';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

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

  // Signal para guardar la entrada que recuperamos de Java
  entradaCargada = signal<Entrada | null>(null);

  categoriasDisponibles: string[] = ['Java', 'Python', 'Hacking', 'Gnosis', 'Ciberseguridad'];

  ngOnInit(): void {
    // Pillamos el ID de la ruta (admin/editar-entrada/:id)
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.entradaService.getEntradaBySlug(slug).subscribe({
        next: (res) => this.entradaCargada.set(res),
        error: () => {
          this.toastService.mostrar('No se ha podido cargar la entrada', 'error');
          this.router.navigate(['/entradas']);
        }
      });
    }
  }

actualizar(datosEditados: Partial<Entrada>): void {
  const entradaActual = this.entradaCargada();
  
  if (entradaActual?.id) {
    console.log('Objeto JSON que va a recibir Java:', datosEditados);
    this.entradaService.updateEntrada(entradaActual.id, datosEditados).subscribe({
      next: () => {
        this.toastService.mostrar('¡Entrada actualizada con éxito!', 'success');
        const slugFinal = datosEditados.slug || entradaActual.slug;
        this.router.navigate(['/entradas', slugFinal]);
      },
      error: (err) => {
        console.error('Error al editar:', err);
        this.toastService.mostrar('Error al validar los datos', 'error');
      }
    });
  }
}

}
