import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { HotelService, Hotel, Habitacion } from '../../hotel.service';
import { LoginComponent } from '../../../auth/login/ts/login.component';
import { RegistroComponent } from '../../../auth/registro/ts/registro.component';
import { PerfilService } from '../../perfil/perfil.service';
import { UsuarioDTO } from '../../perfil/usuario.dto';
import { filter } from 'rxjs/operators';
import { DropdownMenuComponent } from '../../dropdown-menu/ts/dropdown-menu.component';

// Import Swiper
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'app-hoteles-carrusel',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegistroComponent, DropdownMenuComponent],
  templateUrl: './hoteles-carrusel.component.html',
  styleUrls: ['./hoteles-carrusel.component.css'],
})
export class HotelesCarruselComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() filteredHoteles: Hotel[] | null = null;

  isAuthenticated = false;
  userInfo: any = null;
  hoteles: Hotel[] = [];
  loading = false;
  error: string | null = null;
  showLoginModal = false;
  showRegistroModal = false;
  private storageListener: any;
  private routerSubscription: any;
  private swiperInstance: Swiper | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private hotelService: HotelService,
    private perfilService: PerfilService
  ) {
    // Registrar los módulos de Swiper
    Swiper.use([Navigation, Pagination, Autoplay]);
  }

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

  ngAfterViewInit(): void {
    // Inicializar Swiper después de que la vista se haya cargado completamente
    this.initializeSwiper();
  }

  ngOnDestroy(): void {
    // Remover los listeners cuando el componente se destruye
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    // Destruir la instancia de Swiper si existe
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }

  initializeSwiper(): void {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
      const swiperElement = document.querySelector('.swiper-container');
      if (swiperElement && typeof window !== 'undefined' && this.getDisplayHoteles().length > 0) {
        this.swiperInstance = new Swiper('.swiper-container', {
          modules: [Navigation, Pagination, Autoplay],
          slidesPerView: 4,
          spaceBetween: 20,
          loop: true,
          centeredSlides: false,
          speed: 600,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            // when window width >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // when window width >= 480px
            480: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // when window width >= 640px
            640: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            // when window width >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            // when window width >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            // when window width >= 1200px
            1200: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          },
          on: {
            init: () => {
              // Añadir eventos de mouse para detener/reanudar el autoplay
              const swiperContainer = document.querySelector('.swiper-container');
              if (swiperContainer) {
                swiperContainer.addEventListener('mouseenter', () => {
                  if (this.swiperInstance) {
                    this.swiperInstance.autoplay.stop();
                  }
                });

                swiperContainer.addEventListener('mouseleave', () => {
                  if (this.swiperInstance) {
                    this.swiperInstance.autoplay.start();
                  }
                });

                // También añadimos eventos touch para dispositivos móviles
                swiperContainer.addEventListener('touchstart', () => {
                  if (this.swiperInstance) {
                    this.swiperInstance.autoplay.stop();
                  }
                });

                swiperContainer.addEventListener('touchend', () => {
                  if (this.swiperInstance) {
                    // Pequeño retraso para permitir interacción del usuario
                    setTimeout(() => {
                      this.swiperInstance?.autoplay.start();
                    }, 3000);
                  }
                });
              }
            },
          },
        });
      }
    }, 100);
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

        // Reinitializar Swiper después de cargar los hoteles
        if (this.swiperInstance) {
          this.swiperInstance.destroy(true, true);
          this.swiperInstance = null;
        }
        this.initializeSwiper();
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

  // Método para navegar a la página de habitaciones de un hotel
  verHabitaciones(hotelId: number): void {
    this.router.navigate(['/habitaciones', hotelId]);
  }

  // Método para obtener el nombre de la ciudad
  getCiudadNombre(hotel: Hotel): string {
    return hotel.ciudad?.nombre || 'No especificado';
  }

  // Método para obtener el nombre del departamento
  getDepartamentoNombre(hotel: Hotel): string {
    return hotel.ciudad?.departamento?.nombre || 'No especificado';
  }

  // Get the hotels to display (either filtered or all)
  getDisplayHoteles(): Hotel[] {
    return this.filteredHoteles || this.hoteles;
  }

  // Método para obtener un array de números para las estrellas llenas
  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Método para obtener un array de números para las estrellas vacías
  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  // Método para buscar en Google la ubicación del hotel
  buscarEnGoogle(hotel: Hotel): void {
    const ciudad = this.getCiudadNombre(hotel);
    const departamento = this.getDepartamentoNombre(hotel);
    const query = `${ciudad} ${departamento}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Abrir en una nueva pestaña
    window.open(url, '_blank');
  }
}
