export interface Entrada {
  id?: number;
  titulo: string;
  slug?: string;
  contenido: string;
  imagenUrl: string | null; 
  nombreAutor?: string;
  fotoAutor?: string;
  categoriaId: number;
  nombreCategoria: string;
  nombreCategoriaPadre?: string | null; 
  fechaCreacion?: string; 
  fechaActualizacion?: string;
}
