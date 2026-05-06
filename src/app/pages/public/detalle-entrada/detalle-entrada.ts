import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { Entrada } from '../../../core/models/entrada';
import { Auth } from '../../../core/services/auth';
import { ToastLocal } from '../../../shared/components/toast-local/toast-local';

@Component({
  selector: 'app-detalle-entrada',
  imports: [CommonModule, DatePipe, ToastLocal],
  templateUrl: './detalle-entrada.html',
  styleUrl: './detalle-entrada.css',
  standalone: true
}) 

export class DetalleEntrada implements OnInit {

  private authService = inject(Auth); 
  private router = inject(Router);

  entrada: Entrada | null = null;
  cargando: boolean = true;
  error: string = '';

  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private entradaService: EntradaService,
    private cdr: ChangeDetectorRef
  ) {}

  irAtras(): void {
    this.router.navigate(['/entradas']);
  }

  irAEditar(): void {
    console.log('Botón pulsado, entrada actual:', this.entrada);
    if (this.entrada) {
      this.router.navigate(['/entradas/editar-entrada', this.entrada.slug]);
    }
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLogged();

    const slug = this.route.snapshot.paramMap.get('slug');
      if (slug) {
        this.entradaService.getEntradaBySlug(slug).subscribe({
          next: (data) => {
            this.entrada = data;
            this.cargando = false;
            this.cdr.detectChanges(); 
          },
          error: (err) => {
            this.error = 'Entrada no encontrada';
            this.cargando = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.error = 'URL no válida';
        this.cargando = false;
      }
  }
}


