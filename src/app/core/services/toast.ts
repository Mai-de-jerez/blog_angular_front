import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Toast {
  mensaje = signal<string | null>(null);
  tipo = signal<'error' | 'success'>('error'); 
  mostrar(msg: string, tipo: 'error' | 'success' = 'error'){
    this.mensaje.set(msg);
    this.tipo.set(tipo);
    setTimeout(() => this.mensaje.set(null), 3000);
  }
} 
