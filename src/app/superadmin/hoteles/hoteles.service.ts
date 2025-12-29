import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

// Interfaz específica para los hoteles en el panel de superadmin
export interface SuperAdminHotel {
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
export class SuperAdminHotelService {
  private baseUrl = `${environment.apiUrl}/superadmin/hoteles`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHoteles(): Observable<SuperAdminHotel[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<SuperAdminHotel[]>(this.baseUrl, { headers });
  }
}
