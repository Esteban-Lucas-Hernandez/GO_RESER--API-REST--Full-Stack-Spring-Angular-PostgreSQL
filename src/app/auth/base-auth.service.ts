import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BaseAuthService {
  constructor(protected http: HttpClient, protected authService: AuthService) {}

  protected getAuthHeaders(): HttpHeaders {
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
