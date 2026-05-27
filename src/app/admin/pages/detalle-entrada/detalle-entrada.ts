import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { DetalleEntradaCard } from '../../../shared/components/detalle-entrada-card/detalle-entrada-card';
import { Entrada } from '../../../core/models/entrada';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-detalle-entrada',
  imports: [DetalleEntradaCard, ToastLocal],
  templateUrl: './detalle-entrada.html',
  styleUrl: './detalle-entrada.css',
  standalone: true
})
export class DetalleEntrada implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entradaService = inject(EntradaService);
  private toastService = inject(Toast); 

  entrada = signal<Entrada | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.entradaService.getEntrada(id).subscribe({
      next: (e) => {
        this.entrada.set(e);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  irAtras(): void {
    this.router.navigate(['/admin/entradas']);
  }

  irAEditar(): void {
    const e = this.entrada();
    if (e) this.router.navigate(['/admin/entradas/editar', e.id]);
  }

  borrar(): void {
    const e = this.entrada();
    if (!e?.id) return;
    this.entradaService.deleteEntrada(e.id).subscribe({
      next: () => {
        this.toastService.mostrar('Entrada eliminada correctamente', 'success');
        setTimeout(() => this.router.navigate(['/admin/entradas']), 1500);
      }
    });
  }
}
