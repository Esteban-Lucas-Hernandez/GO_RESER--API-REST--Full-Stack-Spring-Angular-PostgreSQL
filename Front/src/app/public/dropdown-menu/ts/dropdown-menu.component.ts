import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
})
export class DropdownMenuComponent {
  @Input() userInfo: any = null;
  open = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggle() {
    this.open = !this.open;
  }

  handleImageError(event: any): void {
    // Establecer una imagen por defecto si falla la carga de la imagen de perfil
    event.target.src =
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  }

  verMisReservas() {
    this.open = false; // Cerrar el menú
    this.router.navigate(['/mis-reservas']);
  }

  verPerfil() {
    this.open = false; // Cerrar el menú
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.open = false; // Cerrar el menú

    // Usar la misma lógica de cierre de sesión que en el componente público
    this.authService.removeToken();
    // También eliminar otros datos del localStorage relacionados con Google
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userFotoUrl'); // Eliminar también la foto URL

    // Recargar la página para reflejar los cambios
    window.location.reload();
  }
}
