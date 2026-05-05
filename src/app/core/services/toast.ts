import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Toast {
  mensaje = signal<string | null>(null);

  mostrar(msg: string) {
    this.mensaje.set(msg);
    setTimeout(() => this.mensaje.set(null), 3000);
  }
} 
