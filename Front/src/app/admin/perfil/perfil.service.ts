import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { UsuarioDTO, ActualizarPerfilDTO } from './usuario.dto';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private baseUrl = 'http://localhost:8080/admin/profile';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método privado para obtener headers de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('PerfilService: Obteniendo token de autenticación');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      console.log('PerfilService: Token encontrado:', token.substring(0, 20) + '...');
      headers = headers.set('Authorization', `Bearer ${token}`);

      // Decodificar el token para verificar su contenido
      try {
        const decodedToken = this.authService.decodeToken(token);
        console.log('PerfilService: Token decodificado:', decodedToken);
        if (decodedToken && decodedToken.roles) {
          console.log('PerfilService: Roles en el token:', decodedToken.roles);
        }
      } catch (e) {
        console.error('PerfilService: Error al decodificar el token:', e);
      }
    } else {
      console.warn('PerfilService: No se encontró token de autenticación');
    }

    // Mostrar los headers que se van a enviar
    console.log('PerfilService: Headers a enviar:', {
      'Content-Type': headers.get('Content-Type'),
      Authorization: headers.get('Authorization'),
    });

    return headers;
  }

  // Obtener información del administrador actual
  getProfile(): Observable<UsuarioDTO> {
    const headers = this.getAuthHeaders();
    console.log('PerfilService: Realizando solicitud GET a', this.baseUrl);

    return this.http.get<UsuarioDTO>(this.baseUrl, { headers }).pipe(catchError(this.handleError));
  }

  // Actualizar información del administrador
  updateProfile(data: ActualizarPerfilDTO): Observable<UsuarioDTO> {
    const headers = this.getAuthHeaders();
    console.log('PerfilService: Realizando solicitud PUT a', this.baseUrl, 'con datos:', data);

    return this.http
      .put<UsuarioDTO>(this.baseUrl, data, { headers })
      .pipe(catchError(this.handleError));
  }


  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('PerfilService: Error en la solicitud HTTP:', error);

    // Devolver un observable con un mensaje de error amigable
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    return throwError(errorMessage);
  }
}
