import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

// Definimos la interfaz HotelDTO según la memoria
export interface HotelDTO {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  estrellas: number;
  politicaCancelacion: string;
  checkIn: string;
  checkOut: string;
  imagenUrl: string;
  createdAt: string;
  updatedAt: string;
  ciudadNombre: string;
  departamentoNombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class HotelAdminService {
  private baseUrl = 'http://localhost:8080/admin/hoteles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHoteles(): Observable<HotelDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<HotelDTO[]>(this.baseUrl, { headers });
  }

  eliminarHotel(id: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }

  actualizarHotel(id: number, hotel: HotelDTO): Observable<HotelDTO> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<HotelDTO>(`${this.baseUrl}/${id}`, hotel, { headers });
  }
}
