import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

// Interfaz para la categoría de habitación
export interface CategoriaHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioId: number;
}

// Interfaz para las habitaciones en el panel de superadmin
export interface SuperAdminHabitacion {
  idHabitacion: number;
  categoria: CategoriaHabitacion;
  numero: string;
  capacidad: number;
  precio: number;
  descripcion: string;
  estado: string;
}

// Interfaz simplificada para los hoteles (solo id y nombre)
export interface HotelSimple {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class SuperAdminHabitacionesService {
  private baseUrl = `${environment.apiUrl}/superadmin/habitaciones`;
  private hotelesUrl = `${environment.apiUrl}/superadmin/hoteles`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHabitaciones(): Observable<SuperAdminHabitacion[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<SuperAdminHabitacion[]>(this.baseUrl, { headers });
  }

  getHabitacionesPorHotel(hotelId: number): Observable<SuperAdminHabitacion[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.baseUrl}/hotel/${hotelId}`;
    return this.http.get<SuperAdminHabitacion[]>(url, { headers });
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
