import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  private entradaService = inject(EntradaService);
  private router = inject(Router);

  irACategoria(categoria: string): void {
    this.entradaService.categoria.set(categoria);
    this.entradaService.paginaActual.set(0);
    this.router.navigate(['/entradas']);
  }
}
