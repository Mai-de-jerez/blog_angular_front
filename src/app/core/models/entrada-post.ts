export interface EntradaPost {
  titulo: string;
  contenido: string;
  categoriaId: number | null;
  imagenUrl?: string | File | null; 
}
