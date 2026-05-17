import { Component, OnInit, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComentarioService } from '../../../core/services/comentario';
import { Auth } from '../../../core/services/auth';
import { Comentario } from '../../../core/models/comentario';
import { ComentarioPost } from '../../../core/models/comentario-post';
import { ComentarioItem } from '../comentario-item/comentario-item';
import { Paginador } from '../paginador/paginador';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ComentarioItem, Paginador ],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css'
})

export class Comentarios implements OnInit {

  entradaId = input.required<number>();

  private readonly comentarioService = inject(ComentarioService);
  readonly auth = inject(Auth);

  // --- ESTADO ---
  comentarios = signal<Comentario[]>([]);
  paginaActual = signal(0);
  totalPaginas = signal(0);
  totalElementos = signal(0);
  cargando = signal(false);
  textoNuevo = signal('');
  enviando = signal(false);

  // --- CICLO DE VIDA ---
  ngOnInit(): void {
    this.cargar();
  }

  // Carga los comentarios de la entrada actual, con paginación
  cargar(): void {
    this.cargando.set(true);
    this.comentarioService.getComentariosPorEntrada(this.entradaId(), this.paginaActual()).subscribe({
      next: (data) => {
        this.comentarios.set(data.contenido);
        this.totalPaginas.set(data.totalPaginas);
        this.totalElementos.set(data.totalElementos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  // Enviar un nuevo comentario raíz (sin padre)
  enviar(): void {
    const texto = this.textoNuevo().trim();
    if (!texto || this.enviando()) return;
    const dto: ComentarioPost = { texto, comentarioPadreId: null };
    this.enviando.set(true);
    this.comentarioService.crearComentario(this.entradaId(), dto).subscribe({
      next: () => {
        this.textoNuevo.set('');
        this.enviando.set(false);
        this.paginaActual.set(0);
        this.cargar();
      },
      error: () => this.enviando.set(false)
    });
  }

  // Manejar el borrado de un comentario (removerlo de la lista y actualizar el total)
  onBorrado(id: number): void {
    this.comentarios.update(list => list.filter(c => c.id !== id));
    this.totalElementos.update(t => t - 1);
  }
}