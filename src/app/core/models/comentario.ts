export interface Comentario {
  id?: number;
  texto: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  usuarioId?: number;
  usernameAutor?: string;
  fotoAutor?: string | null;
  entradaId?: number;
  entradaSlug?: string;
  respuestas?: Comentario[];
} 