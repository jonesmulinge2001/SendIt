import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface EmailLog {
  id: string;
  type: string;
  toEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  parcelId: string;
  status: string;
}
export interface EmailLogsResponse {
  success: boolean;
  message: string;
  data: EmailLog[];
}


@Injectable({
  providedIn: 'root'
})
export class EmailLogsService {
  //private apiUrl =  'http://localhost:3000/admin/email-logs';
   private readonly apiUrl = environment.apiUrl + '/admin/email-logs';


  constructor(
    private http: HttpClient
  ) {}

  private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token') || '';
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getAllEmailLogs(): Observable<EmailLogsResponse> {
      return this.http.get<EmailLogsResponse>(this.apiUrl, {
        headers: this.getAuthHeaders(),
      })
    }
}
