import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

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
  // Información de coordenadas
  latitud: number;
  longitud: number;
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
  // Añadimos coordenadas a la habitación también
  latitud: number;
  longitud: number;
  // Añadimos el nombre del hotel
  hotelNombre: string;
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
  // Información de la ciudad del hotel
  ciudadNombre: string;
  latitud: number;
  longitud: number;
}

// Interfaz para el modelo de reserva
export interface ReservaRequest {
  fechaInicio: string; // Formato YYYY-MM-DD (LocalDate)
  fechaFin: string; // Formato YYYY-MM-DD (LocalDate)
  metodoPago: string; // tarjeta, efectivo, transferencia, nequi, daviplata
}

// Interface para el modelo de reserva de respuesta
export interface Reserva {
  idReserva: number;
  idUsuario: number;
  idHabitacion: number;
  fechaInicio: string; // Formato ISO string
  fechaFin: string; // Formato ISO string
  total: number;
  estado: string;
  metodoPago: string;
  fechaReserva: string; // Formato ISO string
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private baseUrl = 'http://localhost:8080/public/hoteles';
  private reservasUrl = 'http://localhost:8080/api/reservas'; // Base URL para reservas

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método privado para obtener headers de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No se encontró token de autenticación');
    }

    return headers;
  }

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

  // Método para obtener la información de un hotel específico
  getHotelById(hotelId: number): Observable<Hotel> {
    const url = `${this.baseUrl}/${hotelId}`;
    // Para rutas públicas, no enviamos token de autenticación
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.get<Hotel>(url, { headers });
  }

  // Método para crear una reserva
  crearReserva(idHabitacion: number, reserva: ReservaRequest): Observable<any> {
    const url = `${this.reservasUrl}/habitacion/${idHabitacion}`;
    const headers = this.getAuthHeaders();

    return this.http.post(url, reserva, { headers });
  }

  // Método para obtener las reservas del usuario autenticado
  getMisReservas(): Observable<Reserva[]> {
    const url = this.reservasUrl; // http://localhost:8080/api/reservas (sin /usuario)
    const headers = this.getAuthHeaders();

    // Log para debugging
    console.log('Obteniendo mis reservas con headers:', headers);

    return this.http.get<Reserva[]>(url, { headers });
  }

  // Método para obtener todas las reservas (para administradores)
  getTodasLasReservas(): Observable<Reserva[]> {
    const url = this.reservasUrl; // http://localhost:8080/api/reservas
    const headers = this.getAuthHeaders();

    return this.http.get<Reserva[]>(url, { headers });
  }

  // Método para cancelar una reserva
  cancelarReserva(idReserva: number): Observable<any> {
    const url = `${this.reservasUrl}/${idReserva}/cancelar`;
    const headers = this.getAuthHeaders();

    return this.http.put(url, {}, { headers });
  }
}
