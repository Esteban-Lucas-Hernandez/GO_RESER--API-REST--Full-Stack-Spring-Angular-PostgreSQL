import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitacionService } from '../../habitacion.service';
import { HotelAdminService } from '../../../hoteles/hotel-admin.service';
import { HabitacionDTO } from '../../habitacion.interface';
import { HotelDTO } from '../../../hoteles/hotel-admin.service';

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

    // Verificar si hay un hotelId en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      if (params['hotelId']) {
        this.hotelId = +params['hotelId'];
        this.loadHabitaciones(this.hotelId);
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
    }
  }

  verImagenes(habitacionId: number): void {
    if (this.hotelId) {
      this.router.navigate(['/admin/habitacion/imagenes', this.hotelId, habitacionId]);
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
    }
  }

  eliminarHabitacion(habitacionId: number): void {
    if (this.hotelId && confirm('¿Está seguro que desea eliminar esta habitación?')) {
      this.habitacionService.deleteHabitacion(this.hotelId, habitacionId).subscribe({
        next: () => {
          // Recargar la lista después de eliminar
          this.loadHabitaciones(this.hotelId!);
        },
        error: (err: any) => {
          console.error('Error al eliminar habitación:', err);
          this.error = 'No se pudo eliminar la habitación. Por favor, inténtelo más tarde.';
        },
      });
    }
  }

  volverAHotel(): void {
    this.router.navigate(['/admin/hoteles']);
  }
}
