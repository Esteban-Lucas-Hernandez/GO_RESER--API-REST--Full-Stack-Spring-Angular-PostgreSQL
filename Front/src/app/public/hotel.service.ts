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
}
