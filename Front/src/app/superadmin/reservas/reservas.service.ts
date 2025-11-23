import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

// Interfaz para las reservas en el panel de superadmin
export interface SuperAdminReserva {
  idReserva: number;
  fechaInicio: string;
  fechaFin: string;
  total: number;
  estado: string;
  metodoPago: string;
  fechaReserva: string;
}

// Interfaz simplificada para los hoteles (solo id y nombre)
export interface HotelSimple {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class SuperAdminReservasService {
  private baseUrl = 'http://localhost:8080/superadmin/reservas';
  private hotelesUrl = 'http://localhost:8080/superadmin/hoteles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getReservas(): Observable<SuperAdminReserva[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<SuperAdminReserva[]>(this.baseUrl, { headers });
  }

  getReservasPorHotel(hotelId: number): Observable<SuperAdminReserva[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.baseUrl}/hotel/${hotelId}`;
    return this.http.get<SuperAdminReserva[]>(url, { headers });
  }

  getHoteles(): Observable<HotelSimple[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<HotelSimple[]>(this.hotelesUrl, { headers });
  }
}
