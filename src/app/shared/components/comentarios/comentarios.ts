import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ComentarioService } from '../../../core/services/comentario';
import { Auth } from '../../../core/services/auth';
import { Comentario } from '../../../core/models/comentario';
import { ComentarioPost } from '../../../core/models/comentario-post';
import { environment } from '../../../../environments/environment';
import { Paginador } from '../paginador/paginador';

@Component({
  selector: 'app-comentarios', 
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RouterLink, Paginador],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css'
})
export class Comentarios implements OnInit, OnDestroy {

  @Input() entradaId!: number;

  comentarioService = inject(ComentarioService);
  private authService = inject(Auth);
  public readonly mediaUrl = environment.mediaUrl;

  get isLoggedIn(): boolean { return this.authService.isLogged(); }
  get usuarioId(): number | null { return this.authService.getUsuarioId(); }
  get isAdmin(): boolean { return this.authService.isAdmin(); }

  // Lista a mostrar: si hay padre activo, sus hijas; si no, todos los raíz
  get listaActual(): Comentario[] {
    const padre = this.comentarioService.getComentarioPadreActivo();
    if (padre) return padre.respuestas ?? [];
    return this.comentarioService.comentarios();
  }

  // Comentario padre activo (para mostrar encima de sus hijas)
  get padreActual(): Comentario | null {
    return this.comentarioService.getComentarioPadreActivo();
  }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  ngOnDestroy(): void {
    this.comentarioService.resetEstado();
  }

  cargarComentarios(): void {
    this.comentarioService.cargando.set(true);
    this.comentarioService.getComentariosPorEntrada(this.entradaId).subscribe({
      next: (pagina) => {
        this.comentarioService.comentarios.set(pagina.contenido);
        this.comentarioService.totalPaginas.set(pagina.totalPaginas);
        this.comentarioService.cargando.set(false);
      },
      error: () => this.comentarioService.cargando.set(false)
    });
  }

  onPage(page: number): void {
    this.comentarioService.paginaActual.set(page);
    this.cargarComentarios();
  }

  verRespuestas(id: number): void {
    this.comentarioService.verRespuestas(id);
  }

  volverARaiz(): void {
    this.comentarioService.volverARaiz();
  }

  // --- CREAR ---
  enviarComentario(): void {
    if (!this.comentarioService.textoNuevo().trim()) return;
    this.comentarioService.enviando.set(true);
    const dto: ComentarioPost = { texto: this.comentarioService.textoNuevo() };
    this.comentarioService.crearComentario(this.entradaId, dto).subscribe({
      next: () => {
        this.comentarioService.textoNuevo.set('');
        this.comentarioService.enviando.set(false);
        this.cargarComentarios();
      },
      error: () => this.comentarioService.enviando.set(false)
    });
  }

  // --- RESPONDER ---
  activarRespuesta(id: number): void {
    this.comentarioService.respondendoA.set(id);
    this.comentarioService.textoRespuesta.set('');
  }

  cancelarRespuesta(): void {
    this.comentarioService.respondendoA.set(null);
    this.comentarioService.textoRespuesta.set('');
  }

  enviarRespuesta(padreId: number): void {
    if (!this.comentarioService.textoRespuesta().trim()) return;
    this.comentarioService.enviando.set(true);
    const dto: ComentarioPost = {
      texto: this.comentarioService.textoRespuesta(),
      comentarioPadreId: padreId
    };
    this.comentarioService.crearComentario(this.entradaId, dto).subscribe({
      next: () => {
        this.comentarioService.textoRespuesta.set('');
        this.comentarioService.respondendoA.set(null);
        this.comentarioService.enviando.set(false);
        this.cargarComentarios();
      },
      error: () => this.comentarioService.enviando.set(false)
    });
  }

  // --- EDITAR ---
  activarEdicion(comentario: Comentario): void {
    this.comentarioService.editandoId.set(comentario.id!);
    this.comentarioService.textoEditando.set(comentario.texto);
  }

  cancelarEdicion(): void {
    this.comentarioService.editandoId.set(null);
    this.comentarioService.textoEditando.set('');
  }

  guardarEdicion(id: number): void {
    if (!this.comentarioService.textoEditando().trim()) return;
    this.comentarioService.enviando.set(true);
    const dto: ComentarioPost = { texto: this.comentarioService.textoEditando() };
    this.comentarioService.editarComentario(id, dto).subscribe({
      next: () => {
        this.comentarioService.editandoId.set(null);
        this.comentarioService.textoEditando.set('');
        this.comentarioService.enviando.set(false);
        this.cargarComentarios();
      },
      error: () => this.comentarioService.enviando.set(false)
    });
  }

  // --- BORRAR ---
  borrar(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este comentario?')) return;
    this.comentarioService.eliminarComentario(id).subscribe({
      next: () => this.cargarComentarios()
    });
  }

  puedeActuar(usuarioIdComentario: number): boolean {
    return this.usuarioId === usuarioIdComentario || this.isAdmin;
  }
}