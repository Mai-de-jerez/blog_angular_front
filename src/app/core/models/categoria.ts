export interface Categoria {
  id?: number;
  nombre: string;
  slug?: string;
  padreId: number | null;      
  nombrePadre: string | null;   
  fechaCreacion?: string;       
  fechaActualizacion?: string;
}