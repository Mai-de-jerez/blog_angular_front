import { Component, OnInit } from '@angular/core';
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

  constructor(private entradaService: EntradaService) {}

  ngOnInit(): void {
    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        this.entradas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las entradas';
        this.cargando = false;
      }
    });
  }
}
