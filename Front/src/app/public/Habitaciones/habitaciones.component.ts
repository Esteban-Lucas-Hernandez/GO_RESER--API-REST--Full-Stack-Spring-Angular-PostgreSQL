import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, Habitacion } from '../hotel.service';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habitaciones.html',
  styleUrls: ['./habitaciones.css'],
})
export class HabitacionesComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['id'];
      if (this.hotelId) {
        this.loadHabitaciones(this.hotelId);
      }
    });
  }

  loadHabitaciones(hotelId: number): void {
    this.loading = true;
    this.error = null;

    this.hotelService.getHabitacionesByHotelId(hotelId).subscribe({
      next: (data: Habitacion[]) => {
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

  volverAlListado(): void {
    this.router.navigate(['/public']);
  }

  verDetalles(habitacionId: number): void {
    if (this.hotelId) {
      this.router.navigate(['/detalle-habitacion', this.hotelId, habitacionId]);
    }
  }
}
