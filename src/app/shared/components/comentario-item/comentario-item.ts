import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comentario } from '../../../core/models/comentario';
import { ComentarioPost } from '../../../core/models/comentario-post';
import { ComentarioService } from '../../../core/services/comentario';
import { Auth } from '../../../core/services/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-comentario-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comentario-item.html',
  styleUrl: './comentario-item.css'
})
export class ComentarioItem implements OnInit {

  comentario = input.required<Comentario>();
  entradaId = input.required<number>();
  borrado = output<number>();

  private readonly comentarioService = inject(ComentarioService);
  readonly auth = inject(Auth);
  readonly mediaUrl = environment.mediaUrl;

  respuestas = signal<Comentario[]>([]);
  expandido = signal(false);
  pagina = signal(0);
  totalRespuestas = signal(0);
  cargando = signal(false);

  mostrarFormRespuesta = signal(false);
  textoRespuesta = signal('');

  editando = signal(false);
  textoEdicion = signal('');

  ngOnInit(): void {
    this.textoEdicion.set(this.comentario().texto);
    this.cargarTotal();
  }

  private cargarTotal(): void {
    this.comentarioService.getRespuestasPorPadre(this.comentario().id!, 0, 1).subscribe({
      next: (data) => {
        if (data) this.totalRespuestas.set(data.totalElementos);
      }
    });
  }

  get esPropietario(): boolean { return this.auth.userId() === this.comentario().usuarioId; }
  get puedeGestionar(): boolean { return this.esPropietario || this.auth.isAdmin(); }
  get hayMas(): boolean { return this.respuestas().length < this.totalRespuestas(); }

  verRespuestas(): void {
    this.expandido.set(true);
    this.pagina.set(0);
    this.respuestas.set([]);
    this.cargar();
  }

  verMas(): void {
    this.pagina.update(p => p + 1);
    this.cargar();
  }

  verMenos(): void {
    this.expandido.set(false);
    this.respuestas.set([]);
    this.pagina.set(0);
  }


  private cargar(): void {
    this.cargando.set(true);
    this.comentarioService.getRespuestasPorPadre(this.comentario().id!, this.pagina()).subscribe({
      next: (data) => {
        if (data?.contenido) {
          this.respuestas.update(prev => [...prev, ...data.contenido]);
          this.totalRespuestas.set(data.totalElementos);
        }
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  toggleRespuesta(): void {
    this.mostrarFormRespuesta.update(v => !v);
    this.textoRespuesta.set('');
  }

  enviarRespuesta(): void {
    const texto = this.textoRespuesta().trim();
    if (!texto) return;
    const dto: ComentarioPost = { texto, comentarioPadreId: this.comentario().id };
    this.comentarioService.crearComentario(this.entradaId(), dto).subscribe({
      next: (nueva) => {
        this.totalRespuestas.update(t => t + 1);
        if (this.expandido()) {
          this.respuestas.update(prev => [...prev, nueva]);
        } else {
          this.expandido.set(true);
          this.respuestas.set([nueva]);
        }
        this.textoRespuesta.set('');
        this.mostrarFormRespuesta.set(false);
      }
    });
  }

  toggleEdicion(): void {
    this.editando.update(v => !v);
    this.textoEdicion.set(this.comentario().texto);
  }

  guardar(): void {
    const texto = this.textoEdicion().trim();
    if (!texto) return;
    this.comentarioService.editarComentario(this.comentario().id!, { texto }).subscribe({
      next: (actualizado) => {
        this.comentario().texto = actualizado.texto;
        this.comentario().fechaActualizacion = actualizado.fechaActualizacion;
        this.editando.set(false);
      }
    });
  }

  borrar(): void {
    this.comentarioService.borrarComentario(this.comentario().id!).subscribe({
      next: () => this.borrado.emit(this.comentario().id!)
    });
  }

  onBorradoRespuesta(id: number): void {
    this.respuestas.update(list => list.filter(r => r.id !== id));
    this.totalRespuestas.update(t => t - 1);
  }
}