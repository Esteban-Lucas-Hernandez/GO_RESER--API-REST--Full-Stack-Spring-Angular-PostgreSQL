import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

export interface CategoriaHabitacionDTO {
  id?: number;
  nombre: string;
  descripcion: string;
  usuarioId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private baseUrl = `${environment.apiUrl}/admin/categoria`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener todas las categorías
  getCategorias(): Observable<CategoriaHabitacionDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<CategoriaHabitacionDTO[]>(`${this.baseUrl}`, { headers });
  }

  // Obtener una categoría por ID
  getCategoriaById(id: number): Observable<CategoriaHabitacionDTO> {
    const headers = this.getAuthHeaders();
    return this.http.get<CategoriaHabitacionDTO>(`${this.baseUrl}/${id}`, { headers });
  }

  // Crear una nueva categoría
  createCategoria(categoria: CategoriaHabitacionDTO): Observable<CategoriaHabitacionDTO> {
    const headers = this.getAuthHeaders();
    return this.http.post<CategoriaHabitacionDTO>(`${this.baseUrl}`, categoria, { headers });
  }

  // Actualizar una categoría existente
  updateCategoria(
    id: number,
    categoria: CategoriaHabitacionDTO
  ): Observable<CategoriaHabitacionDTO> {
    const headers = this.getAuthHeaders();
    return this.http.put<CategoriaHabitacionDTO>(`${this.baseUrl}/${id}`, categoria, { headers });
  }

  // Eliminar una categoría
  deleteCategoria(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
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
