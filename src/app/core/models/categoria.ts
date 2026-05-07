export interface Categoria {
  id?: number;
  nombre: string;
  slug?: string;
  padreId: number | null;      
  nombrePadre: string | null;  
  subcategorias: Categoria[];  
  fechaCreacion?: string;       
  fechaActualizacion?: string;
}