import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
})
export class PublicComponent implements OnInit {
  isAuthenticated = false;
  userInfo: any = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();

    // Si está autenticado, obtener la información del usuario del token
    if (this.isAuthenticated) {
      const token = this.authService.getToken();
      if (token) {
        const decodedToken = this.authService.decodeToken(token);
        if (decodedToken) {
          this.userInfo = {
            username: decodedToken.username,
            roles: decodedToken.roles,
          };
        }
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.removeToken();
    this.isAuthenticated = false;
    this.userInfo = null;
    // Recargar la página para reflejar los cambios
    window.location.reload();
  }
}
