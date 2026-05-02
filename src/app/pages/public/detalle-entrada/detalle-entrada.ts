import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { EntradaService } from '../../../core/services/entrada';
import { Entrada } from '../../../core/models/entrada';

@Component({
  selector: 'app-detalle-entrada',
  imports: [CommonModule, DatePipe],
  templateUrl: './detalle-entrada.html',
  styleUrl: './detalle-entrada.css',
  standalone: true
})

export class DetalleEntrada implements OnInit {

  entrada: Entrada | null = null;
  cargando: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private entradaService: EntradaService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  irAtras(): void {
  this.location.back();
}

  ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      console.log('🔍 [DETALLE] 1. Pidiendo ID:', id);  

      this.entradaService.getEntrada(id).subscribe({
        next: (data) => {
          console.log('📦 [DETALLE] 2. Datos recibidos del server:', data);
          
          this.entrada = data;
          this.cargando = false;
          
          console.log('✅ [DETALLE] 3. Variable "this.entrada" actualizada:', this.entrada);
      
          this.cdr.detectChanges();
          console.log('🔔 [DETALLE] 4. detectChanges() ejecutado');
          setTimeout(() => {
            console.log('👀 [DETALLE] 5. Verificación post-carga. ¿Sigue el dato?:', this.entrada);
          }, 1000);
        },
        error: (err) => {
          console.error('🔥 [DETALLE] Error en la petición:', err); 
          this.error = 'Entrada no encontrada';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
}
