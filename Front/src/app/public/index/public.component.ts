import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HotelService, Hotel, Habitacion } from '../hotel.service';
import { LoginComponent } from '../../auth/login/ts/login.component';
import { RegistroComponent } from '../../auth/registro/ts/registro.component';
import { PerfilService } from '../perfil/perfil.service';
import { UsuarioDTO } from '../perfil/usuario.dto';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegistroComponent],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
})
export class PublicComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userInfo: any = null;
  hoteles: Hotel[] = [];
  loading = false;
  error: string | null = null;
  showLoginModal = false;
  showRegistroModal = false;
  private storageListener: any;
  private routerSubscription: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private hotelService: HotelService,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();

    // Si está autenticado, obtener la información del usuario del token
    if (this.isAuthenticated) {
      this.loadUserProfile();
    }

    // Cargar la lista de hoteles
    this.loadHoteles();

    // Escuchar cambios en el almacenamiento local para detectar inicio de sesión con Google
    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'auth_token' && event.newValue) {
        // Se ha iniciado sesión, actualizar estado
        this.isAuthenticated = true;
        this.loadUserProfile();
      }
    };

    // Solo agregar el listener si estamos en el navegador
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.storageListener);
    }

    // Escuchar eventos de navegación para actualizar la información del usuario
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Verificar si el usuario está autenticado después de la navegación
        const currentlyAuthenticated = this.authService.isAuthenticated();
        if (currentlyAuthenticated && !this.isAuthenticated) {
          // El usuario acaba de iniciar sesión, cargar su información
          this.isAuthenticated = true;
          this.loadUserProfile();
        } else if (!currentlyAuthenticated && this.isAuthenticated) {
          // El usuario ha cerrado sesión, limpiar la información
          this.isAuthenticated = false;
          this.userInfo = null;
        }
      });
  }

  ngOnDestroy(): void {
    // Remover los listeners cuando el componente se destruye
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadUserProfile(): void {
    console.log('Cargando perfil de usuario...');
    this.perfilService.getProfile().subscribe({
      next: (data: UsuarioDTO) => {
        console.log('Datos del perfil recibidos:', data);
        // Obtener el nombre de usuario del token
        const token = this.authService.getToken();
        let username = 'Usuario';
        if (token) {
          const decodedToken = this.authService.decodeToken(token);
          username = decodedToken?.username || localStorage.getItem('userName') || 'Usuario';
        }

        // Obtener la URL de la foto del localStorage (para usuarios de Google)
        const fotoUrlFromStorage = localStorage.getItem('userFotoUrl');

        // Actualizar la información del usuario con los datos del perfil
        this.userInfo = {
          username: username,
          ...data,
          fotoUrl:
            data.fotoUrl ||
            fotoUrlFromStorage ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        };
        console.log('Información del usuario actualizada:', this.userInfo);
      },
      error: (err) => {
        console.error('Error al cargar el perfil de usuario:', err);
        // Obtener el nombre de usuario del token incluso si falla la carga del perfil
        const token = this.authService.getToken();
        let username = 'Usuario';
        if (token) {
          const decodedToken = this.authService.decodeToken(token);
          username = decodedToken?.username || localStorage.getItem('userName') || 'Usuario';
        }

        // Obtener la URL de la foto del localStorage (para usuarios de Google)
        const fotoUrlFromStorage = localStorage.getItem('userFotoUrl');

        // Usar una imagen por defecto si falla la carga del perfil
        this.userInfo = {
          username: username,
          fotoUrl:
            fotoUrlFromStorage ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        };
        console.log('Información del usuario con imagen por defecto:', this.userInfo);
      },
    });
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

  // Método para manejar errores en la carga de la imagen de perfil
  handleUserImageError(event: any): void {
    // Establecer una imagen por defecto si falla la carga de la imagen de perfil
    event.target.src =
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
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

    // Cargar la información completa del perfil
    this.loadUserProfile();

    // Verificar el rol del usuario y redirigir según corresponda
    setTimeout(() => {
      const userRole = this.authService.getUserRole();
      if (userRole === 'ROLE_ADMIN') {
        // Redirigir a la página de administración
        this.router.navigate(['/admin/dashboard']);
      } else if (userRole === 'ROLE_SUPERADMIN') {
        // Redirigir a la página de superadministración
        this.router.navigate(['/superadmin/usuarios']);
      }
    }, 100);
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
    localStorage.removeItem('userFotoUrl'); // Eliminar también la foto URL

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
