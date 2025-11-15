import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CrearHabitacionDTO, HabitacionDTO } from './habitacion.interface';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private baseUrl = 'http://localhost:8080/admin/hoteles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener todas las habitaciones de un hotel
  getHabitacionesByHotelId(hotelId: number): Observable<HabitacionDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<HabitacionDTO[]>(`${this.baseUrl}/${hotelId}/habitaciones`, { headers });
  }

  // Obtener una habitación específica
  getHabitacionById(hotelId: number, habitacionId: number): Observable<HabitacionDTO> {
    const headers = this.getAuthHeaders();
    return this.http.get<HabitacionDTO>(`${this.baseUrl}/${hotelId}/habitaciones/${habitacionId}`, {
      headers,
    });
  }

  // Crear una nueva habitación
  createHabitacion(
    hotelId: number,
    crearHabitacionDTO: CrearHabitacionDTO
  ): Observable<HabitacionDTO> {
    const headers = this.getAuthHeaders();
    return this.http.post<HabitacionDTO>(
      `${this.baseUrl}/${hotelId}/habitaciones`,
      crearHabitacionDTO,
      { headers }
    );
  }

  // Actualizar una habitación
  updateHabitacion(
    hotelId: number,
    habitacionId: number,
    habitacionDTO: HabitacionDTO
  ): Observable<HabitacionDTO> {
    const headers = this.getAuthHeaders();
    return this.http.put<HabitacionDTO>(
      `${this.baseUrl}/${hotelId}/habitaciones/${habitacionId}`,
      habitacionDTO,
      { headers }
    );
  }

  // Eliminar una habitación
  deleteHabitacion(hotelId: number, habitacionId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${hotelId}/habitaciones/${habitacionId}`, {
      headers,
    });
  }

  // Método privado para obtener los headers de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    // Crear headers con Content-Type y Authorization si hay token
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
