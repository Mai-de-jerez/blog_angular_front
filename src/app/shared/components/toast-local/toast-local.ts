import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../../core/services/toast'; 

@Component({
  selector: 'app-toast-local',
  imports: [CommonModule],
  templateUrl: './toast-local.html',
  styleUrl: './toast-local.css',
  standalone: true  
})

export class ToastLocal {
  toastService = inject(Toast);
}