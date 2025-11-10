import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HotelService, Hotel } from './hotel.service';

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
  hoteles: Hotel[] = [];
  loading = false;
  error: string | null = null;

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
            username: decodedToken.username,
            roles: decodedToken.roles,
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
    event.target.src = 'assets/images/hotel-default.jpg'; // Ruta a una imagen por defecto
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
