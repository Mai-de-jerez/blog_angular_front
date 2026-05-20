export interface UsuarioPost {
  username: string;
  nombre: string;
  apellidos: string;
  pass1: string;
  pass2: string;
  email: string;
  rol?: string;
  telefono: string;
  direccion: string;
  foto?: string | File | null; 
}

