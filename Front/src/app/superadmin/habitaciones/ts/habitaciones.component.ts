import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminHabitacion, HotelSimple } from '../habitaciones.service';
import { SuperAdminHabitacionesService } from '../habitaciones.service';

@Component({
  selector: 'app-superadmin-habitaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: '../html/habitaciones.component.html',
  styleUrls: ['../css/habitaciones.component.css'],
})
export class SuperAdminHabitacionesComponent implements OnInit {
  habitaciones: SuperAdminHabitacion[] = [];
  hoteles: HotelSimple[] = [];
  selectedHotelId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(private habitacionesService: SuperAdminHabitacionesService) {}

  ngOnInit(): void {
    this.loadHoteles();
    this.loadHabitaciones();
  }

  loadHoteles(): void {
    this.habitacionesService.getHoteles().subscribe({
      next: (data: HotelSimple[]) => {
        this.hoteles = data;
      },
      error: (err: any) => {
        console.error('Error al cargar hoteles:', err);
      },
    });
  }

  loadHabitaciones(): void {
    this.loading = true;
    this.error = null;

    if (this.selectedHotelId) {
      this.habitacionesService.getHabitacionesPorHotel(this.selectedHotelId).subscribe({
        next: (data: SuperAdminHabitacion[]) => {
          this.habitaciones = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al cargar habitaciones:', err);
          this.error = 'Error al cargar la lista de habitaciones';
          this.loading = false;
        },
      });
    } else {
      this.habitacionesService.getHabitaciones().subscribe({
        next: (data: SuperAdminHabitacion[]) => {
          this.habitaciones = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al cargar habitaciones:', err);
          this.error = 'Error al cargar la lista de habitaciones';
          this.loading = false;
        },
      });
    }
  }

  onHotelChange(event: any): void {
    const hotelId = event.target.value ? parseInt(event.target.value, 10) : null;
    this.selectedHotelId = hotelId;
    this.loadHabitaciones();
  }

  resetFilter(): void {
    this.selectedHotelId = null;
    this.loadHabitaciones();
  }
}
