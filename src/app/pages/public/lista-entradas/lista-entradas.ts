import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { Entrada } from '../../../core/models/entrada';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-lista-entradas',
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-entradas.html',
  styleUrl: './lista-entradas.css',
  standalone: true
})

export class ListaEntradas implements OnInit {

  public authService = inject(Auth);
  entradas: Entrada[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(private entradaService: EntradaService, private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.entradas = data;
        }
        
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.error = 'Error al cargar las entradas';
        this.cargando = false;
        this.cdr.detectChanges();
        console.error('Error en el listado:', err);
      }
    });
  }
}

