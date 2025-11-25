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

  // Método para obtener el PDF de una reserva
  getReservaPdf(reservaId: number): Observable<Blob> {
    // Validar que el ID de la reserva sea válido
    if (!reservaId || reservaId <= 0) {
      throw new Error('ID de reserva inválido');
    }

    const url = `${this.baseUrl}/${reservaId}/pdf`;
    console.log('Solicitando PDF desde URL:', url);

    const headers = this.getAuthHeaders();
    return this.http.get(url, {
      headers,
      responseType: 'blob',
    });
  }

  // Método para obtener el PDF de todas las reservas de un hotel
  getReservasPorHotelPdf(hotelId: number): Observable<Blob> {
    // Validar que el ID del hotel sea válido
    if (!hotelId || hotelId <= 0) {
      throw new Error('ID de hotel inválido');
    }

    const url = `${this.baseUrl}/hotel/${hotelId}`;
    console.log('Solicitando PDF de reservas por hotel desde URL:', url);

    const headers = this.getAuthHeaders();
    return this.http.get(url, {
      headers,
      responseType: 'blob',
    });
  }

  // Método para eliminar una reserva
  eliminarReserva(idReserva: number): Observable<void> {
    // Validar que el ID de la reserva sea válido
    if (!idReserva || idReserva <= 0) {
      throw new Error('ID de reserva inválido');
    }

    const url = `${this.baseUrl}/${idReserva}`;
    console.log('Eliminando reserva con ID:', idReserva);

    const headers = this.getAuthHeaders();
    return this.http.delete<void>(url, { headers });
  }

  // Método para eliminar reservas canceladas y antiguas
  eliminarReservasCanceladasYAntiguas(): Observable<number> {
    const url = `${this.baseUrl}`;
    console.log('Eliminando reservas canceladas y antiguas');

    const headers = this.getAuthHeaders();
    return this.http.delete<number>(url, { headers });
  }
}
