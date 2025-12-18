import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

// Interfaz para las reseñas corregida según el DTO proporcionado
export interface Resena {
  idResena: number;
  idUsuario: number;
  nombreUsuario: string;
  idHotel: number;
  comentario: string;
  calificacion: number;
  fechaResena: string;
  fotoUrl?: string; // Agregar el campo fotoUrl
}

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
  // Añadimos información adicional del hotel
  email: string;
  descripcionHotel: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  updatedAt: string;
  // Añadimos la imagen del hotel
  hotelImagenUrl: string;
  // Añadimos información de ubicación y calificación del hotel
  estrellas: number;
  ciudadNombre: string;
  departamentoNombre: string;
  // Añadimos política de cancelación
  politicaCancelacion: string;
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
  // Información del hotel
  hotelNombre: string;
  // Información de la ciudad del hotel
  ciudadNombre: string;
  departamentoNombre: string;
  checkIn: string; // LocalTime en el backend
  checkOut: string; // LocalTime en el backend
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
  numeroHabitacion: string;
  nombreHotel: string;
  fechaInicio: string; // Formato ISO string
  fechaFin: string; // Formato ISO string
  total: number;
  estado: string;
  metodoPago: string;
  fechaReserva: string; // Formato ISO string
  urlImagenHabitacion?: string; // Nueva propiedad opcional para la imagen de la habitación
}

// Interface para confirmar pago
export interface PagoConfirmacion {
  idPago?: number;
  idReserva: number;
  referenciaPago?: string;
  metodo: string;
  fechaPago: string; // ISO DateTime
  monto: number;
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private baseUrl = 'http://localhost:8080/public/hoteles';
  private reservasUrl = 'http://localhost:8080/user/reservas'; // Base URL para reservas
  private pagosUrl = 'http://localhost:8080/user/pagos'; // Base URL para pagos
  private resenasUrl = 'http://localhost:8080/public/resenas'; // Base URL para reseñas
  private userResenasUrl = 'http://localhost:8080/user/resenas'; // Base URL para reseñas de usuario
  private userResenaUrl = 'http://localhost:8080/user/resenas'; // Base URL para crear reseña

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

  // Método para obtener todas las reseñas
  getTodasResenas(): Observable<Resena[]> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.get<Resena[]>(this.resenasUrl, { headers });
  }

  // Método para obtener las reseñas de un hotel específico
  getResenasByHotelId(hotelId: number): Observable<Resena[]> {
    const url = `${this.resenasUrl}/hotel/${hotelId}`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.get<Resena[]>(url, { headers });
  }

  // Método para crear una reseña
  createResena(
    hotelId: number,
    resenaData: { comentario: string; calificacion: number }
  ): Observable<Resena> {
    // Asegurémonos de que la URL es correcta
    const url = `${this.userResenaUrl}/hotel/${hotelId}`;
    const headers = this.getAuthHeaders();

    // Para depuración
    console.log('Creando reseña en URL:', url);
    console.log('Headers:', headers);
    console.log('Datos de reseña:', resenaData);

    return this.http.post<Resena>(url, resenaData, { headers });
  }

  // Método para eliminar una reseña del usuario
  deleteResena(idResena: number): Observable<any> {
    const url = `${this.userResenasUrl}/${idResena}`;
    const headers = this.getAuthHeaders();

    return this.http.delete(url, { headers });
  }

  // Método para actualizar una reseña del usuario
  updateResena(idResena: number, resena: Partial<Resena>): Observable<Resena> {
    const url = `${this.userResenasUrl}/${idResena}`;
    const headers = this.getAuthHeaders();

    return this.http.put<Resena>(url, resena, { headers });
  }

  // Método para crear una reserva
  crearReserva(habitacionId: number, reserva: ReservaRequest): Observable<Reserva> {
    const url = `${this.reservasUrl}/habitacion/${habitacionId}`;
    const headers = this.getAuthHeaders();

    return this.http.post<Reserva>(url, reserva, { headers });
  }

  // Método para confirmar un pago
  confirmarPago(idReserva: number, pago: PagoConfirmacion): Observable<Blob> {
    const url = `${this.pagosUrl}/confirmar/${idReserva}`;
    const headers = this.getAuthHeaders();

    // Usamos responseType: 'blob' para recibir el PDF como Blob
    return this.http.post(url, pago, {
      headers,
      responseType: 'blob',
    });
  }

  // Método para obtener las reservas del usuario actual
  getMisReservas(): Observable<Reserva[]> {
    const url = `${this.reservasUrl}`;
    const headers = this.getAuthHeaders();

    return this.http.get<Reserva[]>(url, { headers });
  }

  // Método para cancelar una reserva
  cancelarReserva(idReserva: number): Observable<any> {
    const url = `${this.reservasUrl}/${idReserva}/cancelar`;
    const headers = this.getAuthHeaders();

    return this.http.put<any>(url, {}, { headers });
  }

  // Método para obtener el comprobante de una reserva
  getComprobanteReserva(idReserva: number): Observable<Blob> {
    const url = `${this.reservasUrl}/${idReserva}/comprobante`;
    const headers = this.getAuthHeaders();

    return this.http.get(url, {
      headers,
      responseType: 'blob',
    });
  }

  // Método para obtener las fechas reservadas de una habitación
  getFechasReservadas(habitacionId: number): Observable<string[][]> {
    const url = `${this.reservasUrl}/habitacion/${habitacionId}/fechas-reservadas`;
    const headers = this.getAuthHeaders();

    return this.http.get<string[][]>(url, { headers });
  }
}
