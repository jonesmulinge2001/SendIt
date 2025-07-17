import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ParcelStats } from '../interfaces/parcel-stats';
import { ParcelTrend } from '../interfaces/parcel-trend';
import { UserStats } from '../interfaces/user-stats';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:3000/admin/parcels';

  constructor(private http: HttpClient) {}

  getParcelStats(): Observable<ParcelStats> {
    return this.http.get<{ success: boolean; message: string; data: ParcelStats }>(`${this.apiUrl}/stats`)
      .pipe(map(res => res.data));
  }
  
  getParcelTrends(): Observable<ParcelTrend[]> {
    return this.http.get<ParcelTrend[]>(`${this.apiUrl}/trends`);
  }

  getUserStats() {
    return this.http.get<{ data: UserStats }>('http://localhost:3000/admin/user/users-count');
  }
  
}
