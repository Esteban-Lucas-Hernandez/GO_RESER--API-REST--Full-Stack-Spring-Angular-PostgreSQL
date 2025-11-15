import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, HabitacionDetalle } from '../hotel.service';

@Component({
  selector: 'app-detalle-habitacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './DetalleHabitacion.html',
  styleUrls: ['./DetalleHabitacion.css'],
})
export class DetalleHabitacionComponent implements OnInit {
  habitacion!: HabitacionDetalle;
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  habitacionId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId'];
      this.habitacionId = +params['id'];

      if (this.hotelId && this.habitacionId) {
        this.loadHabitacionDetalle(this.hotelId, this.habitacionId);
      }
    });
  }

  loadHabitacionDetalle(hotelId: number, habitacionId: number): void {
    this.loading = true;
    this.error = null;

    this.hotelService.getHabitacionDetalle(hotelId, habitacionId).subscribe({
      next: (data: HabitacionDetalle) => {
        this.habitacion = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar detalle de habitación:', err);
        this.error =
          'No se pudo cargar el detalle de la habitación. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  volverAlListado(): void {
    if (this.hotelId) {
      this.router.navigate(['/habitaciones', this.hotelId]);
    }
  }
}
