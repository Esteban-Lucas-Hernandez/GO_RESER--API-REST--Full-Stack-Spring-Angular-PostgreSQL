import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  documento: string;
  roles: string[];
  estado: boolean;
  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  private baseUrl = 'http://localhost:8080/superadmin'; // URL base para las APIs de super admin
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getAllUsers(): Observable<Usuario[]> {
    const url = `${this.baseUrl}/usuarios`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`, // Enviar token en el header
    });

    return this.http.get<Usuario[]>(url, { headers });
  }

  // Cambiar el rol de un usuario
  changeUserRole(id: number, newRole: string): Observable<any> {
    const url = `${this.baseUrl}/usuarios/${id}/roles`;
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const data = { roles: [newRole] };

    return this.http.put(url, data, { headers });
  }

  // Método auxiliar para obtener el token
  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
