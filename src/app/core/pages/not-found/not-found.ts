import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="error-container">
      <div class="error-card">
        <div class="icon-placeholder">
          <span class="icon-search"></span>
        </div>
        
        <h1 class="error-code">404</h1>
        
        <div class="dots-container">
          <span class="dot"></span>
          <span class="dot active"></span>
          <span class="dot"></span>
        </div>
        
        <h2 class="error-title">Página no encontrada</h2>
        <p class="error-message">
          La página que buscas no existe o ha sido movida a otra dirección.
        </p>
        
        <button class="btn-back" (click)="volver()">
          <span class="arrow">←</span> Volver al inicio
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Contenedor principal con las franjas laterales claras */
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #c4c2f4; /* Color lila claro de los laterales */
    }

    /* Tarjeta central púrpura oscura */
    .error-card {
      background-color: #231b54; /* Púrpura oscuro principal */
      color: #ffffff;
      text-align: center;
      padding: 3rem 2rem;
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      margin: 0 1rem; 
      border-radius: 12px;
    }

    /* Código 404 */
    .error-code {
      font-size: 7.5rem;
      font-weight: 300;
      margin: 0;
      line-height: 1;
      color: #a39efc; /* Tono lila claro para el número */
      letter-spacing: -2px;
    }

    /* Tres puntos inferiores */
    .dots-container {
      display: flex;
      gap: 8px;
      margin: 1.5rem 0 2rem 0;
    }

    .dot {
      width: 8px;
      height: 8px;
      background-color: #4b3e8e;
      border-radius: 50%;
    }

    .dot.active {
      background-color: #7b6be6;
    }

    /* Textos */
    .error-title {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0 0 1rem 0;
      color: #ffffff;
    }

    .error-message {
      font-size: 1rem;
      color: #8c82d9; /* Texto secundario atenuado */
      max-width: 320px;
      line-height: 1.5;
      margin: 0 0 2.5rem 0;
    }

    /* Botón "Volver al inicio" */
    .btn-back {
      background-color: #4f46e5; /* Color del botón */
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s ease;
    }

    .btn-back:hover {
      background-color: #4338ca;
    }

    .arrow {
      font-size: 1.1rem;
    }
  `]
})
export class NotFound {
  private router = inject(Router);

  volver() {
    this.router.navigate(['/']);
  }
}
