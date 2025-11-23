import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminReserva, HotelSimple } from './reservas.service';
import { SuperAdminReservasService } from './reservas.service';

@Component({
  selector: 'app-superadmin-reservas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class SuperAdminReservasComponent implements OnInit {
  reservas: SuperAdminReserva[] = [];
  hoteles: HotelSimple[] = [];
  selectedHotelId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(private reservasService: SuperAdminReservasService) {}

  ngOnInit(): void {
    this.loadHoteles();
    this.loadReservas();
  }

  loadHoteles(): void {
    this.reservasService.getHoteles().subscribe({
      next: (data: HotelSimple[]) => {
        this.hoteles = data;
      },
      error: (err: any) => {
        console.error('Error al cargar hoteles:', err);
      },
    });
  }

  loadReservas(): void {
    this.loading = true;
    this.error = null;

    if (this.selectedHotelId) {
      this.reservasService.getReservasPorHotel(this.selectedHotelId).subscribe({
        next: (data: SuperAdminReserva[]) => {
          this.reservas = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al cargar reservas:', err);
          this.error = 'Error al cargar la lista de reservas';
          this.loading = false;
        },
      });
    } else {
      this.reservasService.getReservas().subscribe({
        next: (data: SuperAdminReserva[]) => {
          this.reservas = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al cargar reservas:', err);
          this.error = 'Error al cargar la lista de reservas';
          this.loading = false;
        },
      });
    }
  }

  onHotelChange(event: any): void {
    const hotelId = event.target.value ? parseInt(event.target.value, 10) : null;
    this.selectedHotelId = hotelId;
    this.loadReservas();
  }

  resetFilter(): void {
    this.selectedHotelId = null;
    this.loadReservas();
  }
}
