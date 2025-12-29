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

      // Permitir acceso solo a ROLE_USER (para rutas públicas protegidas)
      if (userRole === 'ROLE_USER') {
        return true;
      } else {
        // Redirigir según el rol
        if (userRole === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/panel']);
        } else if (userRole === 'ROLE_SUPERADMIN') {
          this.router.navigate(['/superadmin']);
        } else {
          this.router.navigate(['/public']);
        }
        return false;
      }
    } else {
      // Redirigir a la página de login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}
