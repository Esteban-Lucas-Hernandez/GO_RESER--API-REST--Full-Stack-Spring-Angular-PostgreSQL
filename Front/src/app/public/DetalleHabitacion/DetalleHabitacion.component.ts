import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, HabitacionDetalle, ReservaRequest } from '../hotel.service';
import { AuthService } from '../../auth/auth.service';

// Interface para el modelo de reserva
interface Reserva {
  fechaInicio: string;
  fechaFin: string;
  metodoPago: string;
}

@Component({
  selector: 'app-detalle-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './DetalleHabitacion.html',
  styleUrls: ['./DetalleHabitacion.css'],
})
export class DetalleHabitacionComponent implements OnInit {
  habitacion!: HabitacionDetalle;
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  habitacionId: number | null = null;

  // Variables para el formulario de reserva
  mostrarFormularioReserva = false;
  reserva: Reserva = {
    fechaInicio: '',
    fechaFin: '',
    metodoPago: '',
  };

  // Opciones de métodos de pago
  metodosPago = [
    { valor: 'tarjeta', nombre: 'Tarjeta de crédito/débito' },
    { valor: 'efectivo', nombre: 'Efectivo' },
    { valor: 'transferencia', nombre: 'Transferencia bancaria' },
    { valor: 'nequi', nombre: 'Nequi' },
    { valor: 'daviplata', nombre: 'Daviplata' },
  ];

  // Mensajes de éxito/error para la reserva
  mensajeReserva: string | null = null;
  tipoMensajeReserva: 'exito' | 'error' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private authService: AuthService
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

  // Mostrar/ocultar formulario de reserva
  toggleFormularioReserva(): void {
    this.mostrarFormularioReserva = !this.mostrarFormularioReserva;
    // Limpiar mensajes cuando se abre el formulario
    if (this.mostrarFormularioReserva) {
      this.mensajeReserva = null;
      this.tipoMensajeReserva = null;
    }
  }

  // Validar y enviar formulario de reserva
  onSubmitReserva(): void {
    if (!this.reserva.fechaInicio || !this.reserva.fechaFin || !this.reserva.metodoPago) {
      this.mostrarMensaje('Por favor complete todos los campos', 'error');
      return;
    }

    // Verificar que la fecha de inicio sea anterior o igual a la fecha de fin
    const fechaInicio = new Date(this.reserva.fechaInicio);
    const fechaFin = new Date(this.reserva.fechaFin);

    if (fechaInicio > fechaFin) {
      this.mostrarMensaje('La fecha de inicio debe ser anterior o igual a la fecha de fin', 'error');
      return;
    }

    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.mostrarMensaje('Debe iniciar sesión para realizar una reserva', 'error');
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    // Enviar la reserva
    this.enviarReserva();
  }

  // Enviar la reserva al backend
  enviarReserva(): void {
    if (!this.habitacionId) return;

    // Enviar solo las fechas en formato YYYY-MM-DD (LocalDate)
    const reservaRequest: ReservaRequest = {
      fechaInicio: this.reserva.fechaInicio,
      fechaFin: this.reserva.fechaFin,
      metodoPago: this.reserva.metodoPago,
    };

    this.hotelService.crearReserva(this.habitacionId, reservaRequest).subscribe({
      next: (response) => {
        this.mostrarMensaje('Reserva realizada con éxito', 'exito');

        // Ocultar el formulario después de un breve delay
        setTimeout(() => {
          this.mostrarFormularioReserva = false;
          this.resetFormularioReserva();
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear reserva:', error);
        let mensaje = 'Error al realizar la reserva. Por favor, inténtelo más tarde.';

        // Manejar errores específicos si es posible
        if (error.status === 400) {
          mensaje = 'Datos de reserva inválidos. Por favor revise las fechas.';
        } else if (error.status === 401) {
          mensaje = 'No autorizado. Debe iniciar sesión para realizar una reserva.';
        } else if (error.status === 409) {
          mensaje = 'Las fechas seleccionadas no están disponibles.';
        }

        this.mostrarMensaje(mensaje, 'error');
      },
    });
  }

  // Resetear el formulario de reserva
  resetFormularioReserva(): void {
    this.reserva = {
      fechaInicio: '',
      fechaFin: '',
      metodoPago: '',
    };
  }

  // Mostrar mensaje de éxito o error
  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void {
    this.mensajeReserva = mensaje;
    this.tipoMensajeReserva = tipo;

    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajeReserva = null;
      this.tipoMensajeReserva = null;
    }, 3000);
  }
}
