import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private router = inject(Router);

  irACategoria(nombre: string): void {
    this.router.navigate(['/entradas'], { queryParams: { categoria: nombre } });
  }
}
