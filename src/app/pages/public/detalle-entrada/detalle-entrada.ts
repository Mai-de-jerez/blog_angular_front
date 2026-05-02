import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
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
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  console.log('ID que estoy pidiendo:', id);  

  this.entradaService.getEntrada(id).subscribe({
    next: (data) => {
      console.log('Datos recibidos:', data);  
      this.entrada = data;
      this.cargando = false;
    },
    error: (err) => {
      console.log('Error:', err); 
      this.error = 'Entrada no encontrada';
      this.cargando = false;
    }
  });
}
}
