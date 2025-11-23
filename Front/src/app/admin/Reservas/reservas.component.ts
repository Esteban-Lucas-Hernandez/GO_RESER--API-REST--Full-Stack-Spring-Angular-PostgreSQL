import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelAdminService } from '../hoteles/hotel-admin.service';
import { ReservasService } from './reservas.service';
import { HotelDTO } from '../hoteles/hotel-admin.service';
import { Reserva } from './reserva.interface';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css'],
})
export class ReservasComponent implements OnInit {
  hoteles: HotelDTO[] = [];
  hotelSeleccionado: number | null = null;
  reservas: Reserva[] = [];
  cargandoHoteles = false;
  cargandoReservas = false;

  constructor(private hotelService: HotelAdminService, private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargarHoteles();
  }

  cargarHoteles(): void {
    this.cargandoHoteles = true;
    this.hotelService.getHoteles().subscribe({
      next: (data: HotelDTO[]) => {
        this.hoteles = data;
        this.cargandoHoteles = false;

        // Seleccionar el primer hotel por defecto si hay hoteles
        if (this.hoteles.length > 0) {
          this.hotelSeleccionado = this.hoteles[0].id;
          this.cargarReservasPorHotel(this.hoteles[0].id);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar hoteles:', error);
        this.cargandoHoteles = false;
      },
    });
  }

  onHotelChange(): void {
    if (this.hotelSeleccionado) {
      this.cargarReservasPorHotel(this.hotelSeleccionado);
    }
  }

  cargarReservasPorHotel(hotelId: number): void {
    this.cargandoReservas = true;
    this.reservasService.getReservasPorHotel(hotelId).subscribe({
      next: (data: Reserva[]) => {
        this.reservas = data;
        this.cargandoReservas = false;
      },
      error: (error: any) => {
        console.error('Error al cargar reservas:', error);
        this.reservas = [];
        this.cargandoReservas = false;
      },
    });
  }

  cargarTodasLasReservas(): void {
    this.cargandoReservas = true;
    this.reservasService.getReservas().subscribe({
      next: (data: Reserva[]) => {
        this.reservas = data;
        this.cargandoReservas = false;
      },
      error: (error: any) => {
        console.error('Error al cargar todas las reservas:', error);
        this.reservas = [];
        this.cargandoReservas = false;
      },
    });
  }
}
