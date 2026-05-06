/// navbar.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {
  // Inyectamos el servicio para saber si estamos logueados
  public authService = inject(Auth);
  private router = inject(Router);

  onLogout() {
    this.authService.logout(); 
  }
}