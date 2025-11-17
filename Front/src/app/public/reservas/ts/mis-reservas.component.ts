import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { HotelService } from '../../hotel.service';
import { Reserva } from '../../hotel.service';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../html/mis-reservas.component.html',
  styleUrls: ['../css/mis-reservas.component.css'],
})
export class MisReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.loading = true;
    this.error = null;

    this.hotelService.getMisReservas().subscribe({
      next: (data: Reserva[]) => {
        this.reservas = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar reservas:', err);
        // Manejar específicamente el error 403
        if (err.status === 403) {
          this.error = 'Acceso denegado. No tienes permisos para ver las reservas.';
        } else {
          this.error = 'No se pudieron cargar las reservas. Por favor, inténtelo más tarde.';
        }
        this.loading = false;
      },
    });
  }

  volverAlInicio(): void {
    this.router.navigate(['/public']);
  }
}
