import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Entrada } from '../../../core/models/entrada';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detalle-entrada-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './detalle-entrada-card.html',
  styleUrl: './detalle-entrada-card.css'
})

export class DetalleEntradaCard {
  readonly mediaUrl = environment.mediaUrl;

  entrada = input.required<Entrada>();
  puedeGestionar = input<boolean>(false);

  editar = output<void>();
  eliminar = output<void>();
  volver = output<void>();
}
