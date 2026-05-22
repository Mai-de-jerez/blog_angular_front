/// navbar.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {
  private authService = inject(Auth);
  menuAbierto = false;
  isLogged = this.authService.isLogged;
  isAdmin = this.authService.isAdmin;

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