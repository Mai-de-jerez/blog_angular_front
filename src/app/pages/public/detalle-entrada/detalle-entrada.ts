import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { Entrada } from '../../../core/models/entrada';
import { Auth } from '../../../core/services/auth';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detalle-entrada',
  imports: [CommonModule, DatePipe, ToastLocal],
  templateUrl: './detalle-entrada.html',
  styleUrl: './detalle-entrada.css',
  standalone: true
}) 

export class DetalleEntrada implements OnInit {

  // Inyectamos los servicios necesarios 
  private authService = inject(Auth); 
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private entradaService = inject(EntradaService);
  public readonly mediaUrl = environment.mediaUrl;


  // variables para manejar el estado
  entrada = signal<Entrada | null>(null);
  cargando = signal(true);
  isLoggedIn = signal(false);

  // Para volver a la página anterior
  irAtras(): void {
    this.router.navigate(['/entradas']);
  }

  // Para ir a la página de edición
  irAEditar(): void {
    const e = this.entrada();
    if (e) {
      this.router.navigate(['/entradas/editar-entrada', e.slug]);
    }
  }

  // método para cargar la entrada al iniciar el componente
  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isLogged());
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.entradaService.getEntradaBySlug(slug).subscribe({
        next: (data) => {
          this.entrada.set(data);
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
        }
      });
    } else {
      this.cargando.set(false);
    }
  }
}


