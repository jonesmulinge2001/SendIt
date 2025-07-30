import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parcel } from '../interfaces/parcel';
import { ParcelTrackingEntry } from '../interfaces/parcel-tracking-entry';
import { environment } from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  // private baseUrl = 'http://localhost:3000';
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private get authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // >>> 1. Get Parcels assigned to the driver
  getMyParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.baseUrl}/driver`, {
      headers: this.authHeaders,
    });
  }

  getParcelById(parcelId: string): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.baseUrl}/driver/parcel/${parcelId}`, {
      headers: this.authHeaders
    });
  }
  

  // >>> 2. Update Parcel Status
  updateParcelStatus(parcelId: string, status: 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/driver/${parcelId}/status`,
      { status },
      { headers: this.authHeaders }
    );
  }

  // >>> 3. Add Tracking Entry
  addTrackingEntry(parcelId: string, data: { location: string; note: string }): Observable<ParcelTrackingEntry> {
    return this.http.post<ParcelTrackingEntry>(
      `${this.baseUrl}/admin/parcels/${parcelId}/tracking`,
      data,
      { headers: this.authHeaders }
    );
  }
}
