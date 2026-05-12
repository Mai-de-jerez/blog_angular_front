// app.ts
import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
}) 

export class App {
  protected readonly title = signal('blog-frontend');
  private auth = inject(Auth);
}




