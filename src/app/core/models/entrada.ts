export interface Entrada {
  id?: number;
  titulo: string;
  slug?: string;
  contenido: string;
  imagenUrl: string | File | null;
  autorId?: number;
  nombreAutor?: string;
  fotoAutor?: string;
  categoriaId?: number;
  nombreCategoria?: string;
  nombreCategoriaPadre?: string | null; 
  fechaCreacion?: string; 
  fechaActualizacion?: string;
}
