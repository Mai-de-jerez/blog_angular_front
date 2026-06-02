import { Injectable, signal } from '@angular/core'; 

@Injectable({ providedIn: 'root' })
export class Toast {
  mensaje = signal<string | null>(null);
  tipo = signal<'error' | 'success'>('error');
  
  private timeout: ReturnType<typeof setTimeout> | null = null; 

  mostrar(msg: string, tipo: 'error' | 'success' = 'error') {
    if (this.timeout) clearTimeout(this.timeout);
    this.mensaje.set(msg);
    this.tipo.set(tipo);
    this.timeout = setTimeout(() => this.mensaje.set(null), 3000);
  }
}
