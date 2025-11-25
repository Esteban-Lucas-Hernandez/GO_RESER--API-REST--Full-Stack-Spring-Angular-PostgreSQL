import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HotelService, Hotel, Habitacion } from '../hotel.service';
import { LoginComponent } from '../../auth/login/ts/login.component';
import { RegistroComponent } from '../../auth/registro/ts/registro.component';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegistroComponent],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
})
export class PublicComponent implements OnInit {
  isAuthenticated = false;
  userInfo: any = null;
  hoteles: Hotel[] = [];
  loading = false;
  error: string | null = null;
  showLoginModal = false;
  showRegistroModal = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private hotelService: HotelService
  ) {}

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
            username: decodedToken.username || localStorage.getItem('userName'),
            roles: decodedToken.roles,
          };
        } else {
          // Si no se puede decodificar el token, intentar obtener el nombre de usuario del localStorage
          this.userInfo = {
            username: localStorage.getItem('userName') || 'Usuario',
            roles: [],
          };
        }
      }
    }

    // Cargar la lista de hoteles
    this.loadHoteles();
  }

  loadHoteles(): void {
    this.loading = true;
    this.error = null;

    this.hotelService.getHoteles().subscribe({
      next: (data) => {
        // Para depuración: mostrar en consola los datos recibidos
        console.log('Datos de hoteles recibidos:', data);

        this.hoteles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar hoteles:', err);
        this.error = 'No se pudieron cargar los hoteles. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  handleImageError(event: any): void {
    // Opcional: puedes establecer una imagen por defecto
    event.target.src =
      'https://res.cloudinary.com/dw4e01qx8/f_auto%2Cq_auto/images/mpwgk7gjr9gqqhxmxyum'; // Ruta a una imagen por defecto
    // O simplemente ocultar la imagen:
    // event.target.style.display = 'none';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Método para obtener el nombre de la ciudad
  getCiudadNombre(hotel: Hotel): string {
    return hotel.ciudad?.nombre || 'N/A';
  }

  // Método para obtener el nombre del departamento
  getDepartamentoNombre(hotel: Hotel): string {
    return hotel.ciudad?.departamento?.nombre || 'N/A';
  }

  openLoginModal() {
    this.showLoginModal = true;
    this.showRegistroModal = false;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openRegistroModal() {
    this.showRegistroModal = true;
    this.showLoginModal = false;
  }

  closeRegistroModal() {
    this.showRegistroModal = false;
  }

  onLoginSuccess(event: any) {
    // Cerrar el modal
    this.closeLoginModal();

    // Actualizar el estado de autenticación
    this.isAuthenticated = true;

    // Obtener la información del usuario del token
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = this.authService.decodeToken(token);
      if (decodedToken) {
        this.userInfo = {
          username: decodedToken.username || localStorage.getItem('userName'),
          roles: decodedToken.roles,
        };

        // Verificar el rol del usuario y redirigir según corresponda
        const userRole = this.authService.getUserRole();
        if (userRole === 'ROLE_ADMIN') {
          // Redirigir a la página de administración
          this.router.navigate(['/admin/dashboard']);
        } else if (userRole === 'ROLE_SUPERADMIN') {
          // Redirigir a la página de superadministración
          this.router.navigate(['/superadmin/usuarios']);
        }
      }
    }
  }

  onRegistroSuccess(event: any) {
    // Cerrar el modal de registro
    this.closeRegistroModal();
    // Mostrar mensaje de éxito
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
  }

  logout() {
    this.authService.removeToken();
    // También eliminar otros datos del localStorage relacionados con Google
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    this.isAuthenticated = false;
    this.userInfo = null;
    // Recargar la página para reflejar los cambios
    window.location.reload();
  }

  // Método para ver las habitaciones de un hotel
  verHabitaciones(hotelId: number) {
    // Navegar a la página de habitaciones con el ID del hotel
    this.router.navigate(['/habitaciones', hotelId]);
  }

  // Método para ver las reservas del usuario
  verMisReservas() {
    // Navegar a la página de mis reservas
    this.router.navigate(['/mis-reservas']);
  }

  // Método para ver el perfil del usuario
  verPerfil() {
    // Navegar a la página de perfil
    this.router.navigate(['/perfil']);
  }
}
