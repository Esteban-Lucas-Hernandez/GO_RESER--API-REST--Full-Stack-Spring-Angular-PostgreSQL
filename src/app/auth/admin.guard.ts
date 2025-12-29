import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      // Obtener el rol del usuario
      const userRole = this.authService.getUserRole();
      console.log('AdminGuard - Rol del usuario:', userRole);

      // Verificar si el usuario tiene rol de administrador
      if (userRole === 'ROLE_ADMIN') {
        console.log('AdminGuard - Acceso permitido');
        return true; // Permitir el acceso
      } else if (userRole === 'ROLE_SUPERADMIN') {
        // Redirigir a la página de superadmin si es superadmin
        console.log('AdminGuard - Es superadmin, redirigiendo a /superadmin');
        this.router.navigate(['/superadmin']);
        return false;
      } else {
        // Redirigir a la página principal si es usuario normal
        console.log('AdminGuard - Es usuario normal, redirigiendo a /public');
        this.router.navigate(['/public']);
        return false;
      }
    } else {
      // Redirigir a la página de login si no está autenticado
      console.log('AdminGuard - Usuario no autenticado, redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
