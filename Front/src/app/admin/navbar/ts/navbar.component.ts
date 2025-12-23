import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
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
import { NavbarStateService } from '../../navbar-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isCollapsed = false;

  menuItems = [
    { name: 'Panel', route: '/admin/panel', icon: faHome },
    { name: 'Hoteles', route: '/admin/hoteles', icon: faBuilding },
    { name: 'Categorías', route: '/admin/categoria/listar', icon: faTags },
    { name: 'Habitaciones', route: '/admin/habitacion/listar/1', icon: faBed }, // Ruta por defecto con hotelId = 1
    { name: 'Reservas', route: '/admin/reservas', icon: faCalendarAlt },
    { name: 'Reseñas', route: '/admin/resenas', icon: faStar },
    { name: 'Perfil', route: '/admin/perfil', icon: faUser },
  ];

  faSignOutAlt = faSignOutAlt;
  faArrowLeft = faArrowLeft;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navbarStateService: NavbarStateService
  ) {}

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.navbarStateService.setCollapsed(this.isCollapsed);
  }

  logout(): void {
    // Eliminar el token de autenticación
    this.authService.removeToken();

    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/auth/login']);
  }
}
