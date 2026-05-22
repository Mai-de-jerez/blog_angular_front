import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { Sidebar } from '../../../shared/components/sidebar/sidebar'; 
import { Navbar } from '../../../shared/components/navbar/navbar'; 
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-admin-layout', 
  imports: [RouterOutlet, Sidebar, Navbar, Footer],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  standalone: true,
})
export class AdminLayout {}




