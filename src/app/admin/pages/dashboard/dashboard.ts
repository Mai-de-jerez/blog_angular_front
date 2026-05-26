import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard';
import { DashboardStats } from '../../interfaces/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [],
  standalone: true,
  templateUrl: './dashboard.html', 
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  stats = signal<DashboardStats | null>(null);
  error = signal<boolean>(false);

  ngOnInit() {
    this.dashboardService.obtenerEstadisticas().subscribe({
      next: (data) => this.stats.set(data),
      error: () => this.error.set(true)
    });
  }
}
