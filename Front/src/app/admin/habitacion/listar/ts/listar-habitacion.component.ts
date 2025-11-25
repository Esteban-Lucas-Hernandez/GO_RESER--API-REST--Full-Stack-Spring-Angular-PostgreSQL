import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HabitacionService } from '../../habitacion.service';
import { HotelAdminService } from '../../../hoteles/hotel-admin.service';
import { HabitacionDTO } from '../../habitacion.interface';
import { HotelDTO } from '../../../hoteles/hotel-admin.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-listar-habitacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../html/listar-habitacion.component.html',
  styleUrls: ['../css/listar-habitacion.component.css'],
})
export class ListarHabitacionComponent implements OnInit {
  titulo = 'Gestión de Habitaciones';
  descripcion = 'Aquí puedes administrar las habitaciones de los hoteles.';
  habitaciones: HabitacionDTO[] = [];
  hoteles: HotelDTO[] = [];
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private habitacionService: HabitacionService,
    private hotelService: HotelAdminService
  ) {}

  ngOnInit(): void {
    // Cargar la lista de hoteles
    this.loadHoteles();

    // Cargar todas las habitaciones por defecto
    this.loadTodasLasHabitaciones();

    // Verificar si hay un hotelId en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      if (params['hotelId']) {
        this.hotelId = +params['hotelId'];
        this.loadHabitaciones(this.hotelId);
      }
    });

    // Suscribirse a los eventos de navegación para recargar cuando se entre al componente
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // Si estamos en la ruta base de listado de habitaciones, recargar todas
      if (this.router.url === '/admin/habitacion/listar') {
        this.hotelId = null;
        this.loadTodasLasHabitaciones();
      }
    });
  }

  loadHoteles(): void {
    this.hotelService.getHoteles().subscribe({
      next: (data: HotelDTO[]) => {
        this.hoteles = data;
      },
      error: (err: any) => {
        console.error('Error al cargar hoteles:', err);
        this.error = 'No se pudieron cargar los hoteles. Por favor, inténtelo más tarde.';
      },
    });
  }

  loadTodasLasHabitaciones(): void {
    this.loading = true;
    this.error = null;

    this.habitacionService.getTodasLasHabitaciones().subscribe({
      next: (data: HabitacionDTO[]) => {
        this.habitaciones = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar habitaciones:', err);
        this.error = 'No se pudieron cargar las habitaciones. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  loadHabitaciones(hotelId: number): void {
    this.loading = true;
    this.error = null;

    this.habitacionService.getHabitacionesByHotelId(hotelId).subscribe({
      next: (data: HabitacionDTO[]) => {
        this.habitaciones = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar habitaciones:', err);
        this.error = 'No se pudieron cargar las habitaciones. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  onHotelChange(event: any): void {
    const selectedHotelId = +event.target.value;
    if (selectedHotelId) {
      this.hotelId = selectedHotelId;
      this.router.navigate(['/admin/habitacion/listar', selectedHotelId]);
    } else {
      // Si se selecciona la opción vacía, cargar todas las habitaciones
      this.hotelId = null;
      this.loadTodasLasHabitaciones();
    }
  }

  getHotelName(hotelId: number | undefined): string {
    if (!hotelId) return 'N/A';
    const hotel = this.hoteles.find((h) => h.id === hotelId);
    return hotel ? hotel.nombre : 'Hotel no encontrado';
  }

  verImagenes(habitacionId: number): void {
    if (this.hotelId) {
      this.router.navigate(['/admin/habitacion/imagenes', this.hotelId, habitacionId]);
    } else {
      // Si no hay hotelId específico, necesitamos encontrar a qué hotel pertenece la habitación
      const habitacion = this.habitaciones.find((h) => h.idHabitacion === habitacionId);
      if (habitacion && habitacion.idHotel) {
        this.router.navigate(['/admin/habitacion/imagenes', habitacion.idHotel, habitacionId]);
      } else {
        alert('No se puede determinar el hotel de la habitación seleccionada.');
      }
    }
  }

  crearHabitacion(): void {
    if (this.hotelId) {
      this.router.navigate(['/admin/habitacion/crear', this.hotelId]);
    } else {
      alert('Por favor, seleccione un hotel primero.');
    }
  }

  editarHabitacion(habitacionId: number): void {
    if (this.hotelId) {
      this.router.navigate(['/admin/habitacion/editar', this.hotelId, habitacionId]);
    } else {
      // Si no hay hotelId específico, necesitamos encontrar a qué hotel pertenece la habitación
      const habitacion = this.habitaciones.find((h) => h.idHabitacion === habitacionId);
      if (habitacion && habitacion.idHotel) {
        this.router.navigate(['/admin/habitacion/editar', habitacion.idHotel, habitacionId]);
      } else {
        alert('No se puede determinar el hotel de la habitación seleccionada.');
      }
    }
  }

  eliminarHabitacion(habitacionId: number): void {
    if (confirm('¿Está seguro que desea eliminar esta habitación?')) {
      if (this.hotelId) {
        this.habitacionService.deleteHabitacion(this.hotelId, habitacionId).subscribe({
          next: () => {
            // Recargar la lista después de eliminar
            if (this.hotelId) {
              this.loadHabitaciones(this.hotelId);
            } else {
              this.loadTodasLasHabitaciones();
            }
          },
          error: (err: any) => {
            console.error('Error al eliminar habitación:', err);
            this.error = 'No se pudo eliminar la habitación. Por favor, inténtelo más tarde.';
          },
        });
      } else {
        // Si no hay hotelId específico, necesitamos encontrar a qué hotel pertenece la habitación
        const habitacion = this.habitaciones.find((h) => h.idHabitacion === habitacionId);
        if (habitacion && habitacion.idHotel) {
          this.habitacionService.deleteHabitacion(habitacion.idHotel, habitacionId).subscribe({
            next: () => {
              // Recargar la lista después de eliminar
              this.loadTodasLasHabitaciones();
            },
            error: (err: any) => {
              console.error('Error al eliminar habitación:', err);
              this.error = 'No se pudo eliminar la habitación. Por favor, inténtelo más tarde.';
            },
          });
        } else {
          alert('No se puede determinar el hotel de la habitación seleccionada.');
        }
      }
    }
  }

  volverAHotel(): void {
    this.router.navigate(['/admin/hoteles']);
  }
}
