import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.prod';
import { map } from 'rxjs/operators';


export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER'| 'ADMIN' | 'DRIVER';
  isVerified: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //private apiUrl = 'http://localhost:3000/admin/user';
  private readonly apiUrl = environment.apiUrl + '/admin/user';

  constructor(
    private http: HttpClient
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers(): Observable<{data: User[]}> {
    return this.http.get<{ data: User[]}>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateUserRole(id: string, role: 'USER'| 'ADMIN' | 'DRIVER'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/role`, { role}, {
      headers: this.getHeaders()
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getAllDrivers(): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(res => res.data.filter(user => user.role === 'DRIVER'))
    );
  }
  
}
