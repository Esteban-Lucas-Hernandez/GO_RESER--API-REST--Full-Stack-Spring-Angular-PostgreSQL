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

// Interfaces para departamentos y ciudades
export interface Departamento {
  id: number;
  nombre: string;
}

export interface Ciudad {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class HotelAdminService {
  private baseUrl = 'http://localhost:8080/admin/hoteles';
  private departamentosUrl = 'http://localhost:8080/admin/departamentos';

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

    // Verificar que el ID no sea undefined o null
    if (id === undefined || id === null) {
      throw new Error('ID de hotel no válido');
    }

    return this.http.put<HotelDTO>(`${this.baseUrl}/${id}`, hotel, { headers });
  }

  crearHotel(hotel: HotelDTO): Observable<HotelDTO> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<HotelDTO>(this.baseUrl, hotel, { headers });
  }

  // Método para verificar si un hotel tiene habitaciones
  verificarHabitacionesHotel(id: number): Observable<boolean> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<boolean>(`${this.baseUrl}/${id}/has-habitaciones`, { headers });
  }

  // Método corregido para eliminar un hotel con todas sus dependencias
  eliminarHotelCascade(id: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.baseUrl}/${id}/cascade`, { headers });
  }

  // Nuevos métodos para departamentos y ciudades
  getDepartamentos(): Observable<Departamento[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Departamento[]>(this.departamentosUrl, { headers });
  }

  getCiudadesPorDepartamento(departamentoId: number): Observable<Ciudad[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Ciudad[]>(`${this.departamentosUrl}/${departamentoId}/ciudades`, {
      headers,
    });
  }
}
