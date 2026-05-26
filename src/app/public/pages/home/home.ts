// home.ts
import { Component } from '@angular/core';
import { ToastLocal } from '../../../shared//components/toast-local/toast-local';

@Component({
  selector: 'app-home',
  imports: [ToastLocal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
