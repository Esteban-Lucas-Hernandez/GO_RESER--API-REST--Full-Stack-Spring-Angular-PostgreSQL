import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Resena } from './resena.interface';

@Injectable({
  providedIn: 'root',
})
export class ResenaService {
  private baseUrl = 'http://localhost:8080/admin/resenas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getResenas(): Observable<Resena[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Resena[]>(this.baseUrl, { headers });
  }

  getResenasPorHotel(hotelId: number): Observable<Resena[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Resena[]>(`${this.baseUrl}/hotel/${hotelId}`, { headers });
  }
}
