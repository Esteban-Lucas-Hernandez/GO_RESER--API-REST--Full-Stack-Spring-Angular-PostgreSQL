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

  cancelarReserva(idReserva: number): void {
    if (confirm('¿Está seguro que desea cancelar esta reserva?')) {
      this.hotelService.cancelarReserva(idReserva).subscribe({
        next: () => {
          // Recargar la lista de reservas para actualizar el estado
          this.loadReservas();
          alert('Reserva cancelada exitosamente');
        },
        error: (err: any) => {
          console.error('Error al cancelar reserva:', err);
          if (err.status === 403) {
            alert('No tienes permisos para cancelar esta reserva.');
          } else if (err.status === 404) {
            alert('Reserva no encontrada.');
          } else {
            alert('No se pudo cancelar la reserva. Por favor, inténtelo más tarde.');
          }
        },
      });
    }
  }

  // Método para descargar el comprobante de una reserva
  descargarComprobante(idReserva: number): void {
    this.hotelService.getComprobanteReserva(idReserva).subscribe({
      next: (blob: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante-reserva-${idReserva}.pdf`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();

        // Limpiar el objeto URL después de la descarga
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err: any) => {
        console.error('Error al descargar comprobante:', err);
        alert('No se pudo descargar el comprobante. Por favor, inténtelo más tarde.');
      },
    });
  }

  // Método para verificar si una reserva puede tener comprobante (pagos confirmados)
  puedeDescargarComprobante(reserva: Reserva): boolean {
    // Solo mostrar el botón para reservas con estado "CONFIRMADA" o similar
    return (
      reserva.estado?.toUpperCase() === 'CONFIRMADA' ||
      reserva.estado?.toUpperCase() === 'PAGADA' ||
      reserva.estado?.toUpperCase() === 'COMPLETADA'
    );
  }

  // Método para verificar si una reserva puede ser cancelada
  puedeCancelarReserva(reserva: Reserva): boolean {
    // No permitir cancelar si la fecha de salida es anterior a la fecha actual
    const fechaSalida = new Date(reserva.fechaFin);
    const fechaActual = new Date();
    
    // Comparar solo las fechas (sin horas)
    fechaSalida.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);
    
    return fechaSalida >= fechaActual;
  }
}
