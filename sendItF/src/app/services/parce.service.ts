import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Parcel, ParcelResponse } from '../interfaces/parcel';
import { CreateParcelDto } from '../interfaces/create-parcel-interface';
import { environment } from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ParcelService {
  // Private base URL for non-admin endpoints
  //private readonly baseUrl = environment.apiUrl + '/parcels';
  // Admin base URL for admin-only actions
  private readonly adminBaseUrl = environment.apiUrl + '/admin/parcels';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllParcels(): Observable<Parcel[]> {
    return this.http
      .get<ParcelResponse>(`${this.adminBaseUrl}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
      .pipe(map((response: ParcelResponse) => response.data));
  }

  getParcels(filters: any = {}): Observable<Parcel[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value.toString());
      }
    });

    return this.http
      .get<{ success: boolean; data: Parcel[] }>(`${this.adminBaseUrl}`, { params })
      .pipe(map((res) => res.data));
  }

  createParcel(parcel: CreateParcelDto): Observable<Parcel> {
    return this.http.post<Parcel>(this.adminBaseUrl, parcel, {
      headers: this.getAuthHeaders(),
    });
  }

  updateParcel(id: string, updates: Partial<Parcel>): Observable<Parcel> {
    return this.http.patch<Parcel>(`${this.adminBaseUrl}/${id}`, updates, {
      headers: this.getAuthHeaders(),
    });
  }

  updateParcelStatus(
    id: string,
    status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  ): Observable<Parcel> {
    return this.http.patch<Parcel>(
      `${this.adminBaseUrl}/${id}/status`,
      { status },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  deleteParcel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getParcelById(id: string): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.adminBaseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /** 
   * NEW: Assign a parcel to a driver (admin endpoint)
   */
  assignDriver(parcelId: string, driverId: string): Observable<Parcel> {
    return this.http.patch<Parcel>(
      `${this.adminBaseUrl}/${parcelId}/assign-driver`,
      { driverId },
      { headers: this.getAuthHeaders() }
    );
  }
}
