import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  HotelService,
  HabitacionDetalle,
  ReservaRequest,
  PagoConfirmacion,
  Reserva,
} from '../hotel.service';
import { AuthService } from '../../auth/auth.service';
import { NavComponent } from '../nav/nav.component';
import { Nav1Component } from '../nav1/nav1.component';
import { FooterComponent } from '../footer/footer.component';

// Interface para el modelo de reserva en el formulario
interface ReservaForm {
  fechaInicio: string;
  fechaFin: string;
  metodoPago: string;
}

@Component({
  selector: 'app-detalle-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav1Component, FooterComponent],
  templateUrl: './DetalleHabitacion.html',
  styleUrls: ['./DetalleHabitacion.css'],
})
export class DetalleHabitacionComponent implements OnInit, AfterViewInit {
  habitacion!: HabitacionDetalle;
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  habitacionId: number | null = null;

  // Variable para almacenar las fechas reservadas
  fechasReservadas: string[][] = [];

  // Variable para la imagen principal seleccionada
  imagenPrincipal: string = '';

  // Variables para el modal de galería
  mostrarModal: boolean = false;
  imagenModal: string = '';
  indiceImagenActual: number = 0;

  // Variables para el formulario de reserva
  mostrarFormularioReserva = false;
  reserva: ReservaForm = {
    fechaInicio: '',
    fechaFin: '',
    metodoPago: '',
  };

  // Variables para el selector de fechas
  mostrarSelectorFechas = false;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  mesActual: number;
  anioActual: number;
  hoy: Date;

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

  // Variables para el modal de pago
  mostrarModalPago = false;
  reservaCreada: any = null;
  pagoConfirmacion: PagoConfirmacion = {
    idReserva: 0,
    metodo: '',
    fechaPago: '',
    monto: 0,
  };
  procesandoPago = false;
  mensajePago: string | null = null;
  tipoMensajePago: 'exito' | 'error' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private authService: AuthService
  ) {
    // Configurar la fecha de hoy con la zona horaria de Colombia (GMT-5)
    this.hoy = new Date();
    this.hoy.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para comparaciones
    this.mesActual = this.hoy.getMonth();
    this.anioActual = this.hoy.getFullYear();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId'];
      this.habitacionId = +params['id'];

      if (this.hotelId && this.habitacionId) {
        this.loadHabitacionDetalle(this.hotelId, this.habitacionId);
      }
    });
  }

  ngAfterViewInit(): void {
    // Posicionar la vista en la parte superior al cargar
    window.scrollTo(0, 0);
  }

  loadHabitacionDetalle(hotelId: number, habitacionId: number): void {
    this.loading = true;
    this.error = null;

    this.hotelService.getHabitacionDetalle(hotelId, habitacionId).subscribe({
      next: (data: HabitacionDetalle) => {
        this.habitacion = data;
        // Establecer la primera imagen como imagen principal si existen imágenes
        if (data.imagenesUrls && data.imagenesUrls.length > 0) {
          this.imagenPrincipal = data.imagenesUrls[0];
        }
        this.loading = false;

        // Cargar las fechas reservadas después de obtener los detalles de la habitación
        this.loadFechasReservadas(habitacionId);
      },
      error: (err: any) => {
        console.error('Error al cargar detalle de habitación:', err);
        this.error =
          'No se pudo cargar el detalle de la habitación. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  // Método para cargar las fechas reservadas
  loadFechasReservadas(habitacionId: number): void {
    this.hotelService.getFechasReservadas(habitacionId).subscribe({
      next: (fechas: string[][]) => {
        this.fechasReservadas = fechas;
        console.log('Fechas reservadas cargadas:', this.fechasReservadas);
      },
      error: (err: any) => {
        console.error('Error al cargar fechas reservadas:', err);
        // No mostramos error al usuario ya que esto no bloquea la funcionalidad principal
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

  // Funciones para el selector de fechas
  abrirSelectorFechas(): void {
    this.mostrarSelectorFechas = true;
    // Reiniciar al mes actual si estamos viendo un mes diferente
    this.mesActual = this.hoy.getMonth();
    this.anioActual = this.hoy.getFullYear();
  }

  cerrarSelectorFechas(): void {
    this.mostrarSelectorFechas = false;
  }

  cambiarMes(delta: number): void {
    this.mesActual += delta;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
  }

  obtenerNombreMes(anio: number, mes: number): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[mes];
  }

  obtenerDiasDelMes(anio: number, mes: number): number[] {
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    return Array.from({ length: diasEnMes }, (_, i) => i + 1);
  }

  // Verificar si una fecha es tanto fecha de salida de una reserva como fecha de entrada de otra reserva el mismo día
  esFechaSalidaYEntrada(anio: number, mes: number, dia: number): boolean {
    // Crear fecha con zona horaria de Colombia
    const fecha = new Date(anio, mes, dia);
    fecha.setHours(0, 0, 0, 0); // Normalizar la hora

    if (this.fechasReservadas && this.fechasReservadas.length > 0) {
      let esFechaSalida = false;
      let esFechaEntrada = false;

      // Verificar si la fecha es fecha de salida de alguna reserva
      for (const rango of this.fechasReservadas) {
        if (rango.length === 2) {
          // Parsear la fecha de fin de reserva
          const partesFin = rango[1].split('-');
          const fechaFin = new Date(
            parseInt(partesFin[0]),
            parseInt(partesFin[1]) - 1,
            parseInt(partesFin[2])
          );
          fechaFin.setHours(0, 0, 0, 0);

          // Verificar si la fecha coincide con la fecha de fin
          if (fecha.getTime() === fechaFin.getTime()) {
            esFechaSalida = true;
            break;
          }
        }
      }

      // Verificar si la fecha es fecha de entrada de alguna reserva
      for (const rango of this.fechasReservadas) {
        if (rango.length === 2) {
          // Parsear la fecha de inicio de reserva
          const partesInicio = rango[0].split('-');
          const fechaInicio = new Date(
            parseInt(partesInicio[0]),
            parseInt(partesInicio[1]) - 1,
            parseInt(partesInicio[2])
          );
          fechaInicio.setHours(0, 0, 0, 0);

          // Verificar si la fecha coincide con la fecha de inicio
          if (fecha.getTime() === fechaInicio.getTime()) {
            esFechaEntrada = true;
            break;
          }
        }
      }

      // Si la fecha es tanto salida como entrada, bloquearla
      return esFechaSalida && esFechaEntrada;
    }

    return false;
  }

  // Verificar si una fecha es la fecha de inicio de una reserva
  esFechaInicioDeReserva(anio: number, mes: number, dia: number): boolean {
    // Crear fecha con zona horaria de Colombia
    const fecha = new Date(anio, mes, dia);
    fecha.setHours(0, 0, 0, 0); // Normalizar la hora

    if (this.fechasReservadas && this.fechasReservadas.length > 0) {
      for (const rango of this.fechasReservadas) {
        if (rango.length === 2) {
          // Parsear la fecha de inicio de reserva
          const partesInicio = rango[0].split('-');
          const fechaInicio = new Date(
            parseInt(partesInicio[0]),
            parseInt(partesInicio[1]) - 1,
            parseInt(partesInicio[2])
          );
          fechaInicio.setHours(0, 0, 0, 0);

          // Verificar si la fecha coincide con la fecha de inicio
          if (fecha.getTime() === fechaInicio.getTime()) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // Verificar si una fecha está bloqueada (ya sea por ser pasada, por estar reservada, por ser salida y entrada el mismo día, o por ser el día actual cuando hay reserva que comienza ese día)
  esFechaBloqueada(anio: number, mes: number, dia: number): boolean {
    // Crear fecha con zona horaria de Colombia
    const fecha = new Date(anio, mes, dia);
    fecha.setHours(0, 0, 0, 0); // Normalizar la hora

    // Obtener la fecha de hoy con zona horaria de Colombia
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Bloquear fechas pasadas
    if (fecha < hoy) {
      return true;
    }

    // Bloquear fechas que son tanto salida como entrada
    if (this.esFechaSalidaYEntrada(anio, mes, dia)) {
      return true;
    }

    // Bloquear el día actual si hay una reserva que comienza ese día
    if (fecha.getTime() === hoy.getTime() && this.esFechaInicioDeReserva(anio, mes, dia)) {
      return true;
    }

    // Bloquear solo las noches intermedias de las reservas existentes
    // Ni la fecha de entrada ni la fecha de salida deben bloquearse
    if (this.fechasReservadas && this.fechasReservadas.length > 0) {
      for (const rango of this.fechasReservadas) {
        if (rango.length === 2) {
          // Parsear las fechas de reserva considerando la zona horaria de Colombia
          const partesInicio = rango[0].split('-');
          const fechaInicio = new Date(
            parseInt(partesInicio[0]),
            parseInt(partesInicio[1]) - 1,
            parseInt(partesInicio[2])
          );
          fechaInicio.setHours(0, 0, 0, 0);

          const partesFin = rango[1].split('-');
          const fechaFin = new Date(
            parseInt(partesFin[0]),
            parseInt(partesFin[1]) - 1,
            parseInt(partesFin[2])
          );
          fechaFin.setHours(0, 0, 0, 0);

          // Verificar si la fecha está dentro del rango de reserva (excluyendo los extremos)
          // Para una reserva del 21 al 24, bloquear solo 22 y 23
          if (fecha > fechaInicio && fecha < fechaFin) {
            return true;
          }
        }
      }
    }

    return false;
  }

  seleccionarDia(dia: number): void {
    // No permitir seleccionar días bloqueados
    if (this.esFechaBloqueada(this.anioActual, this.mesActual, dia)) {
      return;
    }

    const fechaSeleccionada = new Date(this.anioActual, this.mesActual, dia);

    if (!this.fechaInicio || (this.fechaInicio && this.fechaFin)) {
      // Si no hay fecha de inicio o ya hay ambas fechas, establecer nueva fecha de inicio
      this.fechaInicio = fechaSeleccionada;
      this.fechaFin = null;
    } else if (fechaSeleccionada < this.fechaInicio) {
      // Si la fecha seleccionada es antes de la fecha de inicio, hacerla la nueva fecha de inicio
      this.fechaInicio = fechaSeleccionada;
    } else {
      // Si la fecha seleccionada es después de la fecha de inicio, hacerla la fecha de fin
      this.fechaFin = fechaSeleccionada;
    }
  }

  esDiaSeleccionado(anio: number, mes: number, dia: number): boolean {
    const fecha = new Date(anio, mes, dia);
    if (this.fechaInicio && this.fechaFin) {
      return (
        fecha.getTime() === this.fechaInicio.getTime() ||
        fecha.getTime() === this.fechaFin.getTime()
      );
    } else if (this.fechaInicio) {
      return fecha.getTime() === this.fechaInicio.getTime();
    }
    return false;
  }

  esRangoSeleccionado(anio: number, mes: number, dia: number): boolean {
    if (!this.fechaInicio || !this.fechaFin) return false;

    const fecha = new Date(anio, mes, dia);
    return fecha > this.fechaInicio && fecha < this.fechaFin;
  }

  esFechaInicio(anio: number, mes: number, dia: number): boolean {
    if (!this.fechaInicio) return false;

    const fecha = new Date(anio, mes, dia);
    return fecha.getTime() === this.fechaInicio.getTime();
  }

  esFechaFin(anio: number, mes: number, dia: number): boolean {
    if (!this.fechaFin) return false;

    const fecha = new Date(anio, mes, dia);
    return fecha.getTime() === this.fechaFin.getTime();
  }

  confirmarSeleccionFechas(): void {
    if (this.fechaInicio) {
      this.reserva.fechaInicio = this.fechaInicio.toISOString().split('T')[0];
    }
    if (this.fechaFin) {
      this.reserva.fechaFin = this.fechaFin.toISOString().split('T')[0];
    }
    this.mostrarSelectorFechas = false;
  }

  // Validar y enviar formulario de reserva
  onSubmitReserva(event: Event): void {
    if (!this.reserva.fechaInicio || !this.reserva.fechaFin || !this.reserva.metodoPago) {
      this.mostrarMensaje('Por favor complete todos los campos', 'error');
      return;
    }

    // Verificar que la fecha de inicio sea anterior o igual a la fecha de fin
    const fechaInicio = new Date(this.reserva.fechaInicio);
    const fechaFin = new Date(this.reserva.fechaFin);

    if (fechaInicio > fechaFin) {
      this.mostrarMensaje(
        'La fecha de inicio debe ser anterior o igual a la fecha de fin',
        'error'
      );
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

    // Prevenir el envío del formulario por defecto
    event.preventDefault();

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
      next: (response: Reserva) => {
        console.log('Reserva creada:', response);
        this.reservaCreada = response;

        // Calcular el monto total (precio * días)
        const fechaInicio = new Date(this.reserva.fechaInicio);
        const fechaFin = new Date(this.reserva.fechaFin);
        const dias = Math.ceil(
          (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
        );
        const montoTotal = this.habitacion.precio * dias;

        // Inicializar el formulario de pago
        this.pagoConfirmacion = {
          idReserva: response.idReserva,
          metodo: this.reserva.metodoPago,
          fechaPago: new Date().toISOString(),
          monto: montoTotal,
        };

        // Cerrar formulario de reserva y abrir modal de pago
        this.mostrarFormularioReserva = false;
        this.mostrarModalPago = true;
      },
      error: (error: any) => {
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
    this.fechaInicio = null;
    this.fechaFin = null;
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

  // Cerrar modal de pago
  cerrarModalPago(): void {
    this.mostrarModalPago = false;
    this.mensajePago = null;
    this.tipoMensajePago = null;
    this.resetFormularioReserva();
  }

  // Confirmar pago
  confirmarPago(): void {
    this.procesandoPago = true;
    const idReserva = this.pagoConfirmacion.idReserva;

    // Generar una referencia de pago automática
    this.pagoConfirmacion.referenciaPago = 'REF-' + new Date().getTime();

    this.hotelService.confirmarPago(idReserva, this.pagoConfirmacion).subscribe({
      next: (response: Blob) => {
        console.log('Respuesta recibida:', response);

        // Verificar si la respuesta es un PDF válido
        if (response.type === 'application/pdf') {
          console.log('PDF confirmado, descargando...');

          // Crear un enlace para descargar el PDF
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // Crear un elemento <a> temporal para la descarga
          const a = document.createElement('a');
          a.href = url;
          a.download = `comprobante-pago-${idReserva}.pdf`; // Nombre del archivo
          document.body.appendChild(a);
          a.click();

          // Limpiar el DOM
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          this.mostrarMensajePago(
            'Pago confirmado exitosamente. Descargando comprobante...',
            'exito'
          );
        } else {
          // Si no es un PDF, leer el contenido para ver qué es
          const reader = new FileReader();
          reader.onload = () => {
            console.log('Contenido de la respuesta:', reader.result);
            this.mostrarMensajePago('Error: La respuesta no es un PDF válido', 'error');
          };
          reader.readAsText(response);
        }

        // Cerrar modal después de un breve delay
        setTimeout(() => {
          this.procesandoPago = false;
          this.cerrarModalPago();
          this.mostrarMensaje('Reserva y pago realizados con éxito', 'exito');
        }, 2000);
      },
      error: (error: any) => {
        console.error('Error al confirmar pago:', error);
        this.procesandoPago = false;

        let mensaje = 'Error al confirmar el pago. Por favor, inténtelo más tarde.';
        if (error.status === 400) {
          mensaje = 'Datos de pago inválidos. Por favor revise la información.';
        } else if (error.status === 404) {
          mensaje = 'No se encontró la reserva.';
        }

        this.mostrarMensajePago(mensaje, 'error');
      },
    });
  }

  // Mostrar mensaje de pago
  mostrarMensajePago(mensaje: string, tipo: 'exito' | 'error'): void {
    this.mensajePago = mensaje;
    this.tipoMensajePago = tipo;

    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajePago = null;
      this.tipoMensajePago = null;
    }, 3000);
  }

  // Método para cambiar la imagen principal
  cambiarImagenPrincipal(imagenUrl: string): void {
    this.imagenPrincipal = imagenUrl;
  }

  // Métodos para el modal de galería
  abrirModal(): void {
    if (this.habitacion.imagenesUrls && this.habitacion.imagenesUrls.length > 0) {
      this.mostrarModal = true;
      this.indiceImagenActual = 0;
      this.imagenModal = this.habitacion.imagenesUrls[0];
      // Prevenir el scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarModal(event: Event): void {
    // Solo cerrar si se hace clic en el fondo del modal o en el botón de cerrar
    if (event.target === event.currentTarget) {
      this.mostrarModal = false;
      // Restaurar el scroll del body
      document.body.style.overflow = 'auto';
    }
  }

  imagenAnterior(): void {
    if (this.habitacion.imagenesUrls && this.habitacion.imagenesUrls.length > 0) {
      this.indiceImagenActual =
        (this.indiceImagenActual - 1 + this.habitacion.imagenesUrls.length) %
        this.habitacion.imagenesUrls.length;
      this.imagenModal = this.habitacion.imagenesUrls[this.indiceImagenActual];
    }
  }

  imagenSiguiente(): void {
    if (this.habitacion.imagenesUrls && this.habitacion.imagenesUrls.length > 0) {
      this.indiceImagenActual = (this.indiceImagenActual + 1) % this.habitacion.imagenesUrls.length;
      this.imagenModal = this.habitacion.imagenesUrls[this.indiceImagenActual];
    }
  }

  // Cerrar el modal con la tecla Escape
  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: Event) {
    if (this.mostrarModal) {
      this.mostrarModal = false;
      document.body.style.overflow = 'auto';
    }
    if (this.mostrarFormularioReserva) {
      this.mostrarFormularioReserva = false;
      document.body.style.overflow = 'auto';
    }
  }

  // Método para cerrar el modal de reserva
  cerrarModalReserva(event: Event): void {
    // Solo cerrar si se hace clic en el fondo del modal o en el botón de cerrar
    if (event.target === event.currentTarget) {
      this.mostrarFormularioReserva = false;
      // Restaurar el scroll del body
      document.body.style.overflow = 'auto';
    }
  }
}
