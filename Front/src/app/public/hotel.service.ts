import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Actualizamos la interfaz para reflejar la estructura real que envía el backend
export interface Ciudad {
  id: number;
  nombre: string;
  departamento?: Departamento;
}

export interface Departamento {
  id: number;
  nombre: string;
}

export interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  estrellas: number;
  politicaCancelacion: string;
  checkIn: string; // LocalTime en el backend
  checkOut: string; // LocalTime en el backend
  imagenUrl: string;
  createdAt: string; // LocalDateTime en el backend
  updatedAt: string; // LocalDateTime en el backend
  ciudad: Ciudad; // Objeto anidado en lugar de ciudadNombre
}

// Interfaz para CategoriaHabitacionDTO
export interface CategoriaHabitacion {
  idCategoria: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
}

// Interfaz para HabitacionDTO con la categoría
export interface Habitacion {
  idHabitacion: number;
  idHotel: number;
  categoria: CategoriaHabitacion;
  numero: string;
  capacidad: number;
  precio: number;
  descripcion: string;
  estado: string;
  imagenUrl: string;
}

// Interfaz para HabitacionDetalleDTO
export interface HabitacionDetalle {
  idHabitacion: number;
  idHotel: number;
  categoria: CategoriaHabitacion;
  numero: string;
  capacidad: number;
  precio: number;
  descripcion: string;
  estado: string;
  imagenesUrls: string[];
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private baseUrl = 'http://localhost:8080/public/hoteles';

  constructor(private http: HttpClient) {}

  getHoteles(): Observable<Hotel[]> {
    // Para rutas públicas, no enviamos token de autenticación
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.get<Hotel[]>(this.baseUrl, { headers });
  }

  // Método para obtener las habitaciones de un hotel específico
  getHabitacionesByHotelId(hotelId: number): Observable<Habitacion[]> {
    const url = `${this.baseUrl}/${hotelId}/habitaciones`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.get<Habitacion[]>(url, { headers });
  }

  // Método para obtener el detalle de una habitación específica
  getHabitacionDetalle(hotelId: number, habitacionId: number): Observable<HabitacionDetalle> {
    const url = `${this.baseUrl}/${hotelId}/habitaciones/${habitacionId}`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.get<HabitacionDetalle>(url, { headers });
  }
}
