import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faBuilding,
  faTags,
  faBed,
  faCalendarAlt,
  faStar,
  faUser,
  faSignOutAlt,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-superadmin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class SuperAdminNavbarComponent {
  isCollapsed = false;

  menuItems = [
    { name: 'Usuarios', route: '/superadmin/usuarios', icon: faUser },
    { name: 'Hoteles', route: '/superadmin/hoteles', icon: faBuilding },
    { name: 'Habitaciones', route: '/superadmin/habitaciones', icon: faBed },
    { name: 'Reservas', route: '/superadmin/reservas', icon: faCalendarAlt },
    { name: 'Perfil', route: '/superadmin/perfil', icon: faUser },
  ];

  faSignOutAlt = faSignOutAlt;
  faArrowLeft = faArrowLeft;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    // Eliminar el token de autenticación
    this.authService.removeToken();

    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/auth/login']);
  }
}