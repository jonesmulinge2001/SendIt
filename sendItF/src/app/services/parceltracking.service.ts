import { Injectable } from '@angular/core';
import { ParcelTrackingEntry } from '../interfaces/parcel-tracking-entry';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.prod';

export interface TrackingHistoryResponse {
  success: boolean;
  message: string;
  data: ParcelTrackingEntry[];
}

export interface SingleTrackingEntryResponse {
  success: boolean;
  message: string;
  data: ParcelTrackingEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class ParceltrackingService {
  //private apiUrl = 'http://localhost:3000/admin/parcels';
     private readonly apiUrl = environment.apiUrl + '/admin/parcels';
  constructor(
    private http: HttpClient
  ) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }
  }

  getAllTracking(): Observable<TrackingHistoryResponse> {
    return this.http.get<TrackingHistoryResponse>(`${this.apiUrl}/tracking/all`, {
      headers: this.getAuthHeaders().headers
    });
  }

  getTrackingByParcel(parcelId: string): Observable<TrackingHistoryResponse> {
    return this.http.get<TrackingHistoryResponse>(`${this.apiUrl}/${parcelId}/tracking`, this.getAuthHeaders());
  }

  addTrackingEntry(parcelId: string, payload: {status: string, location: string, note: string}): Observable<SingleTrackingEntryResponse> {
    return this.http.post<SingleTrackingEntryResponse>(`${this.apiUrl}/${parcelId}/tracking`, payload, this.getAuthHeaders());
  }
}
