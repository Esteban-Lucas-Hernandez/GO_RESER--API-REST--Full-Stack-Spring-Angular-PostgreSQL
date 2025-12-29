import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { UsuarioDTO } from './usuario.dto';
import { ActualizarPerfilDTO } from './actualizar-perfil.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private baseUrl = `${environment.apiUrl}/superadmin/profile`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método privado para obtener headers de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('SuperAdminPerfilService: Obteniendo token de autenticación');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      console.log('SuperAdminPerfilService: Token encontrado:', token.substring(0, 20) + '...');
      headers = headers.set('Authorization', `Bearer ${token}`);

      try {
        const decodedToken = this.authService.decodeToken(token);
        console.log('SuperAdminPerfilService: Token decodificado:', decodedToken);
        if (decodedToken && decodedToken.roles) {
          console.log('SuperAdminPerfilService: Roles en el token:', decodedToken.roles);
        }
      } catch (e) {
        console.error('SuperAdminPerfilService: Error al decodificar el token:', e);
      }
    } else {
      console.warn('SuperAdminPerfilService: No se encontró token de autenticación');
    }

    console.log('SuperAdminPerfilService: Headers a enviar:', {
      'Content-Type': headers.get('Content-Type'),
      Authorization: headers.get('Authorization'),
    });

    return headers;
  }

  // Obtener información del superadministrador actual
  getProfile(): Observable<UsuarioDTO> {
    const headers = this.getAuthHeaders();
    console.log('SuperAdminPerfilService: Realizando solicitud GET a', this.baseUrl);

    return this.http.get<UsuarioDTO>(this.baseUrl, { headers }).pipe(catchError(this.handleError));
  }

  // Actualizar información del superadministrador
  updateProfile(data: ActualizarPerfilDTO): Observable<UsuarioDTO> {
    const headers = this.getAuthHeaders();
    console.log(
      'SuperAdminPerfilService: Realizando solicitud PUT a',
      this.baseUrl,
      'con datos:',
      data
    );

    return this.http
      .put<UsuarioDTO>(this.baseUrl, data, { headers })
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('SuperAdminPerfilService: Error en la solicitud HTTP:', error);

    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    return throwError(errorMessage);
  }
}
