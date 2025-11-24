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
        console.log('Hoteles recibidos:', data);
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
        console.log('Reservas recibidas:', data);
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
        console.log('Todas las reservas recibidas:', data);
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

  // Método para descargar el PDF de una reserva individual
  descargarPdf(reservaId: number): void {
    // Validar que el ID de la reserva sea válido
    if (!reservaId || reservaId <= 0) {
      console.error('ID de reserva inválido:', reservaId);
      alert('No se puede descargar el PDF: ID de reserva inválido.');
      return;
    }

    console.log('Descargando PDF para la reserva ID:', reservaId);

    this.reservasService.getReservaPdf(reservaId).subscribe({
      next: (blob: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reserva-${reservaId}.pdf`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();

        // Limpiar el objeto URL después de la descarga
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error: any) => {
        console.error('Error al descargar PDF para la reserva ID:', reservaId, error);
        if (error.status === 403) {
          alert('No tiene permisos para descargar el PDF de esta reserva.');
        } else if (error.status === 404) {
          alert('No se encontró el PDF para esta reserva.');
        } else {
          alert('No se pudo descargar el PDF. Por favor, inténtelo más tarde.');
        }
      },
    });
  }

  // Método para descargar el PDF de todas las reservas de un hotel
  descargarPdfPorHotel(): void {
    // Validar que haya un hotel seleccionado
    if (!this.hotelSeleccionado || this.hotelSeleccionado <= 0) {
      console.error('No hay hotel seleccionado');
      alert('Por favor, seleccione un hotel primero.');
      return;
    }

    console.log('Descargando PDF para todas las reservas del hotel ID:', this.hotelSeleccionado);

    this.reservasService.getReservasPorHotelPdf(this.hotelSeleccionado).subscribe({
      next: (blob: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservas-hotel-${this.hotelSeleccionado}.pdf`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();

        // Limpiar el objeto URL después de la descarga
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error: any) => {
        console.error(
          'Error al descargar PDF para las reservas del hotel ID:',
          this.hotelSeleccionado,
          error
        );
        if (error.status === 403) {
          alert('No tiene permisos para descargar el PDF de las reservas de este hotel.');
        } else if (error.status === 404) {
          alert('No se encontró el PDF para las reservas de este hotel.');
        } else {
          alert('No se pudo descargar el PDF. Por favor, inténtelo más tarde.');
        }
      },
    });
  }
}
