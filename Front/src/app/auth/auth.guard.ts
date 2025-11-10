import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      // Obtener el rol del usuario
      const userRole = this.authService.getUserRole();

      // Verificar si el usuario tiene rol de administrador
      if (userRole === 'ROLE_ADMIN') {
        return true; // Permitir el acceso
      } else {
        // Redirigir a la página principal si no es administrador
        this.router.navigate(['/public']);
        return false;
      }
    } else {
      // Redirigir a la página de login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}
