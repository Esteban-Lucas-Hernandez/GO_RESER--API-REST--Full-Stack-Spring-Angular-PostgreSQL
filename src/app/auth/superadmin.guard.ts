import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      // Obtener el rol del usuario
      const userRole = this.authService.getUserRole();
      console.log('SuperAdminGuard - Rol del usuario:', userRole);

      // Verificar si el usuario tiene rol de super administrador
      if (userRole === 'ROLE_SUPERADMIN') {
        console.log('SuperAdminGuard - Acceso permitido');
        return true; // Permitir el acceso
      } else {
        // Redirigir a la página principal si no es super administrador
        console.log('SuperAdminGuard - Acceso denegado, redirigiendo a /public');
        this.router.navigate(['/public']);
        return false;
      }
    } else {
      // Redirigir a la página de login si no está autenticado
      console.log('SuperAdminGuard - Usuario no autenticado, redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
