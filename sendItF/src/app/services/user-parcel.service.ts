import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Parcel } from '../interfaces/parcel';
import { ParcelTrackingHistory } from '../interfaces/parcel-tracking-history';
import { environment } from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UserParcelService {
  //private baseUrl = 'http://localhost:3000/dashboard';
  private readonly baseUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private getUserEmail(): string {
    return localStorage.getItem('email') || '';
  }

  getSentParcels(): Observable<Parcel[]> {
    const email = this.getUserEmail();
    return this.http
      .get<{ success: boolean; data: Parcel[] }>(
        `${this.baseUrl}/sent`,
        {
          headers: this.getAuthHeaders(),
          params: new HttpParams().set('email', email),
        }
      )
      .pipe(map((res) => res.data));
  }

  getReceivedParcels(): Observable<Parcel[]> {
    const email = this.getUserEmail();
    return this.http
      .get<{ success: boolean; data: Parcel[] }>(
        `${this.baseUrl}/received`,
        {
          headers: this.getAuthHeaders(),
          params: new HttpParams().set('email', email),
        }
      )
      .pipe(map((res) => res.data));
  }

  getPendingPickups(): Observable<Parcel[]> {
    const email = this.getUserEmail();
    return this.http
      .get<{ success: boolean; data: Parcel[] }>(
        `${this.baseUrl}/pending-pickups`,
        {
          headers: this.getAuthHeaders(),
          params: new HttpParams().set('email', email),
        }
      )
      .pipe(map((res) => res.data));
  }

  getTrackingHistory(parcelId: string): Observable<ParcelTrackingHistory[]> {
    return this.http
      .get<{ success: boolean; data: ParcelTrackingHistory[] }>(
        `${this.baseUrl}/tracking-history`,
        {
          headers: this.getAuthHeaders(),
          params: new HttpParams().set('parcelId', parcelId),
        }
      )
      .pipe(map((res) => res.data));
  }
}
