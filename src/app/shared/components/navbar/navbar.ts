/// navbar.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {
  public authService = inject(Auth);
  menuAbierto = false;

  onLogout() {
    this.authService.logout();
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }
}