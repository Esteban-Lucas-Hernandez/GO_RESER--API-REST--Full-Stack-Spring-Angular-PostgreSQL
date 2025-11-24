import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

// Interfaz para las reservas en el panel de superadmin
export interface SuperAdminReserva {
  idReserva: number;
  emailUsuario: string;
  numeroHabitacion: string;
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

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getReservas(): Observable<SuperAdminReserva[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<SuperAdminReserva[]>(this.baseUrl, { headers });
  }

  getReservasPorHotel(hotelId: number): Observable<SuperAdminReserva[]> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/hotel/${hotelId}`;
    return this.http.get<SuperAdminReserva[]>(url, { headers });
  }

  getHoteles(): Observable<HotelSimple[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<HotelSimple[]>(this.hotelesUrl, { headers });
  }

  // Método para obtener el PDF de una reserva
  getReservaPdf(idReserva: number): Observable<Blob> {
    // Validar que el ID de la reserva sea válido
    if (!idReserva || idReserva <= 0) {
      throw new Error('ID de reserva inválido');
    }

    const url = `${this.baseUrl}/${idReserva}/pdf`;
    console.log('Solicitando PDF desde URL:', url);

    const headers = this.getAuthHeaders();
    return this.http.get(url, {
      headers,
      responseType: 'blob',
    });
  }
}
