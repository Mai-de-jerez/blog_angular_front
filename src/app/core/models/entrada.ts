export interface Entrada {
  id: number;
  titulo: string;
  slug: string;
  contenido: string;
  imagenUrl: string;
  fechaCreacion: string; // "2026-05-01T16:56:25"
  fechaActualizacion: string; // "2026-05-04T11:03:46"
  
  autor: {
    id: number;
    username: string;
    foto: string;
  };
  
  categoria: {
    id: number;
    nombre: string;
    fechaCreacion: string;
    fechaActualizacion: string;
  };
}
