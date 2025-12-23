import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { PerfilService } from '../../perfil/perfil.service';
import { UsuarioDTO } from '../../perfil/usuario.dto';
import { LoginComponent } from '../../../auth/login/ts/login.component';
import { RegistroComponent } from '../../../auth/registro/ts/registro.component';
import { DropdownMenuComponent } from '../../../public/dropdown-menu/ts/dropdown-menu.component';

@Component({
  selector: 'app-nav1',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegistroComponent, DropdownMenuComponent],
  templateUrl: './nav1.component.html',
  styleUrls: ['./nav1.component.css'],
})
export class Nav1Component implements OnInit {
  isAuthenticated = false;
  userInfo: any = null;
  showLoginModal = false;
  showRegistroModal = false;
  showMobileMenu = false;
  isSignUpActive = false; // Propiedad para controlar el estado del formulario
  private storageListener: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();

    // Si está autenticado, obtener la información del usuario del token
    if (this.isAuthenticated) {
      this.loadUserProfile();
    }

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

      // Agregar listener para cambios en el tamaño de la ventana
      window.addEventListener('resize', this.onResize.bind(this));
    }

    // Escuchar eventos de navegación para actualizar la información del usuario
    this.router.events
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

        // Cerrar el menú móvil al cambiar de ruta
        this.showMobileMenu = false;
      });
  }

  onResize() {
    // Cerrar el menú móvil si la pantalla es más grande que 580px
    if (window.innerWidth > 580) {
      this.showMobileMenu = false;
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // Método para alternar entre inicio de sesión y registro
  toggleSignUp() {
    this.isSignUpActive = true;
  }

  toggleSignIn() {
    this.isSignUpActive = false;
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

  openLoginModal() {
    this.showLoginModal = true;
    this.showRegistroModal = false;
    this.isSignUpActive = false; // Resetear al abrir el modal
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openRegistroModal() {
    this.showRegistroModal = true;
    this.showLoginModal = false;
    this.isSignUpActive = true; // Activar el formulario de registro
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
    // Cambiar al formulario de inicio de sesión después del registro exitoso
    this.isSignUpActive = false;
    // Mostrar mensaje de éxito
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
  }

  // Método para desplazarse a la sección de búsqueda del hero
  scrollToHeroSearch(event: Event) {
    event.preventDefault();
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      // Calcular posición con offset para evitar que quede justo en el borde
      const yOffset = -80; // Ajustar para compensar el navbar fijo
      const y = heroSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });

      // Enfocar el input de búsqueda
      const searchInput = heroSection.querySelector('.search-input');
      if (searchInput) {
        setTimeout(() => {
          (searchInput as HTMLElement).focus();
        }, 800); // Ajustar tiempo para coincidir con la duración del scroll
      }
    }

    // Cerrar el menú móvil después de hacer clic
    this.showMobileMenu = false;
  }

  // Método para desplazarse al carrusel de hoteles
  scrollToHotels(event: Event) {
    event.preventDefault();
    const hotelsSection = document.querySelector('.hoteles-section');
    if (hotelsSection) {
      // Calcular posición con offset para evitar que quede justo en el borde
      const yOffset = -80; // Ajustar para compensar el navbar fijo
      const y = hotelsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Cerrar el menú móvil después de hacer clic
    this.showMobileMenu = false;
  }

  // Método para desplazarse al footer
  scrollToFooter(event: Event) {
    event.preventDefault();
    const footer = document.querySelector('app-footer');
    if (footer) {
      // Desplazarse al final de la página
      window.scrollTo({
        top: document.documentElement.scrollHeight - window.innerHeight + 50,
        behavior: 'smooth',
      });
    }

    // Cerrar el menú móvil después de hacer clic
    this.showMobileMenu = false;
  }
}
