import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe, NgStyle } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ResenaService } from '../../resenas/resena.service';
import { Resena } from '../../resenas/resena.interface';
import { IngresosComponent } from '../ingresos/ts/ingresos.component';
import { PerfilService } from '../../perfil/perfil.service';
import { UsuarioDTO } from '../../perfil/usuario.dto';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, SlicePipe, NgStyle, IngresosComponent],
  templateUrl: '../html/panel.component.html',
  styleUrls: ['../css/panel.component.css'],
  providers: [DatePipe],
})
export class PanelComponent implements OnInit, OnDestroy {
  panelData: any = null;
  userInfo: any = null;
  userProfile: UsuarioDTO | null = null;
  ultimasResenas: Resena[] = [];
  categorias: any[] = [];
  isMobileView: boolean = false;
  private resizeSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private resenaService: ResenaService,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    // Obtener la información del usuario del token
    this.loadUserInfoFromToken();
    // Cargar los datos del panel
    this.loadPanelData();
    // Cargar las últimas reseñas
    this.loadUltimasResenas();
    // Cargar las categorías
    this.loadCategorias();
    // Cargar el perfil del usuario
    this.loadUserProfile();
    // Detectar tamaño de pantalla
    this.checkScreenSize();
    // Escuchar cambios en el tamaño de la ventana
    this.resizeSubscription = this.onResize().subscribe(() => {
      this.checkScreenSize();
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private onResize(): Observable<Event> {
    return new Observable((observer) => {
      const handler = (event: Event) => observer.next(event);
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    });
  }

  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < 560;
  }

  loadUserInfoFromToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = this.authService.decodeToken(token);
      if (decodedToken) {
        this.userInfo = {
          username: decodedToken.username,
          email: decodedToken.sub,
          userId: decodedToken.userId,
          roles: decodedToken.roles,
        };
      }
    }
  }

  loadUserProfile(): void {
    this.perfilService.getProfile().subscribe({
      next: (profile: UsuarioDTO) => {
        this.userProfile = profile;
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
      },
    });
  }

  loadPanelData(): void {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.get(`${environment.apiUrl}/admin/dashboard`, { headers }).subscribe({
        next: (data: any) => {
          this.panelData = data;
        },
        error: (error: any) => {
          console.error('Error loading panel data:', error);
        },
      });
    }
  }

  loadUltimasResenas(): void {
    this.resenaService.getResenas().subscribe({
      next: (resenas: Resena[]) => {
        // Ordenar por fecha descendente y tomar las últimas 5
        this.ultimasResenas = resenas
          .sort((a, b) => new Date(b.fechaResena).getTime() - new Date(a.fechaResena).getTime())
          .slice(0, 5);
      },
      error: (error: any) => {
        console.error('Error cargando últimas reseñas:', error);
      },
    });
  }

  loadCategorias(): void {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // Cargar categorías con información adicional
      this.http.get<any[]>(`${environment.apiUrl}/admin/categoria`, { headers }).subscribe({
        next: (data: any[]) => {
          this.categorias = data;
          // Aquí podrías cargar información adicional si es necesario
        },
        error: (error: any) => {
          console.error('Error cargando categorías:', error);
        },
      });
    }
  }

  getCategoriaColor(index: number): string {
    // Colores variados para las categorías
    const colores = [
      '#E3F2FD', // Azul muy claro (casi blanco)
      '#B3E5FC', // Azul cielo
      '#81D4FA', // Azul celeste
      '#4FC3F7', // Azul claro vibrante
      '#29B6F6', // Azul medio
      '#039BE5', // Azul intenso
      '#1E88E5', // Azul rey
      '#1565C0', // Azul profundo
      '#0D47A1', // Azul marino
      '#263238', // Azul grisáceo oscuro
    ];
    return colores[index % colores.length];
  }

  getBarColor(calificacion: number): string {
    // Colores específicos: azul oscuro para 5 estrellas, azul más claro para 4 estrellas, etc.
    if (calificacion === 5) {
      return 'linear-gradient(to top, #001f3f, #004c99)'; // 5 estrellas - Azul oscuro
    } else if (calificacion === 4) {
      return 'linear-gradient(to top, #004c99, #0080ff)'; // 4 estrellas - Azul un poco más claro
    } else if (calificacion === 3) {
      return 'linear-gradient(to top, #0080ff, #33ccff)'; // 3 estrellas - Azul claro
    } else if (calificacion === 2) {
      return 'linear-gradient(to top, #33ccff, #66d9ff)'; // 2 estrellas - Azul más claro
    } else {
      return 'linear-gradient(to top, #66d9ff,rgb(139, 218, 245))'; // 1 estrella - Azul muy claro
    }
  }

  getPieSliceStyle(index: number, total: number): any {
    // Usar un enfoque más simple con rotación básica
    const rotate = index * (360 / total);
    return {
      transform: `rotate(${rotate}deg)`,
      'clip-path': 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)',
    };
  }

  // Nuevo método para obtener el estilo de clip-path específico
  getPieSliceClip(index: number, total: number): string {
    if (total <= 1) {
      // Si solo hay una categoría, mostrar el círculo completo
      return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
    }

    const sliceAngle = 360 / total;
    const startAngle = index * sliceAngle;
    const endAngle = (index + 1) * sliceAngle;

    // Convertir ángulos a coordenadas
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const startX = 50 + 50 * Math.cos(startRad);
    const startY = 50 + 50 * Math.sin(startRad);
    const endX = 50 + 50 * Math.cos(endRad);
    const endY = 50 + 50 * Math.sin(endRad);

    // Para ángulos mayores a 180 grados, necesitamos un clip-path diferente
    if (sliceAngle > 180) {
      return `polygon(50% 50%, ${startX.toFixed(2)}% ${startY.toFixed(
        2
      )}%, 0% 0%, 0% 100%, 100% 100%, 100% 0%, ${endX.toFixed(2)}% ${endY.toFixed(2)}%)`;
    } else {
      return `polygon(50% 50%, ${startX.toFixed(2)}% ${startY.toFixed(2)}%, ${endX.toFixed(
        2
      )}% ${endY.toFixed(2)}%)`;
    }
  }

  verTodasLasResenas(): void {
    this.router.navigate(['/admin/resenas']);
  }

  verTodasLasCategorias(): void {
    this.router.navigate(['/admin/categoria/listar']);
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/public']);
  }
}
