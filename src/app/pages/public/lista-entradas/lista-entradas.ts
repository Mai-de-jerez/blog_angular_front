import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EntradaService } from '../../../core/services/entrada';
import { Entrada } from '../../../core/models/entrada';

@Component({
  selector: 'app-lista-entradas',
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-entradas.html',
  styleUrl: './lista-entradas.css',
  standalone: true
})

export class ListaEntradas implements OnInit {

  entradas: Entrada[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(private entradaService: EntradaService, private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    console.log('🚀 [LISTA] 1. Componente iniciado. Llamando al servicio...');

    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        console.log('📦 [LISTA] 2. ¡Datos recibidos con éxito!');
        console.table(data); // Esto te saca una tabla preciosa en la consola

        if (data && data.length > 0) {
          this.entradas = data;
          console.log('✅ [LISTA] 3. Array de entradas actualizado. Longitud:', this.entradas.length);
        } else {
          console.warn('⚠️ [LISTA] 3. El servicio respondió, pero el array está VACÍO.');
        }

        this.cargando = false;
        
        // El martillazo para que Angular pinte sí o sí
        console.log('🔔 [LISTA] 4. Forzando detección de cambios...');
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('🔥 [LISTA] 2. ERROR detectado en la suscripción:', err);
        this.error = 'Error al cargar las entradas';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('🏁 [LISTA] 5. Flujo del Observable completado.');
      }
    });
  }
}

