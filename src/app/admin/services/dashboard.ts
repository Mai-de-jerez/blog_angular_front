import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../interfaces/dashboard';


@Injectable({
  providedIn: 'root',
})

export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/health`;

  obtenerEstadisticas(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.url);
  }
}
