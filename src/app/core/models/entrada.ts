export interface Entrada {
  id?: number;
  titulo: string;
  slug: string;
  contenido: string;
  imagenUrl: string;
  nombreAutor?: string;
  fotoAutor?: string;
  nombreCategoria: string;
  fechaCreacion?: string; 
  fechaActualizacion?: string;
}
