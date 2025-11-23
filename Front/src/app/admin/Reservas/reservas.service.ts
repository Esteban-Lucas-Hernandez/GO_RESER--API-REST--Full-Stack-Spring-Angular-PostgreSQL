import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private baseUrl = 'http://localhost:8080/admin/reservas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getReservas(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  getReservasPorHotel(hotelId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/hotel/${hotelId}`, { headers });
  }
}
