import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export class AuthUtils {
  static getAuthHeaders(authService: AuthService): HttpHeaders {
    const token = authService.getToken();

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
