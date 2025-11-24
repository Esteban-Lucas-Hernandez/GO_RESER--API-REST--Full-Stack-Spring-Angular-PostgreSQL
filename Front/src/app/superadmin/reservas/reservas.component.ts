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

  // Método para descargar el PDF de una reserva
  descargarPdf(idReserva: number): void {
    // Validar que el ID de la reserva sea válido
    if (!idReserva || idReserva <= 0) {
      console.error('ID de reserva inválido:', idReserva);
      alert('No se puede descargar el PDF: ID de reserva inválido.');
      return;
    }

    console.log('Descargando PDF para la reserva ID:', idReserva);

    this.reservasService.getReservaPdf(idReserva).subscribe({
      next: (blob: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reserva-${idReserva}.pdf`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();

        // Limpiar el objeto URL después de la descarga
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error: any) => {
        console.error('Error al descargar PDF para la reserva ID:', idReserva, error);
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
}
