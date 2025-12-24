import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelAdminService } from '../hotel-admin.service';
import { HotelDTO } from '../hotel-admin.service';
import { EditarHotelComponent } from '../editar/ts/editar-hotel.component';
import { CrearHotelComponent } from '../crear/ts/crear-hotel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faCity,
  faMap,
  faStar,
  faSignInAlt,
  faSignOutAlt,
  faImage,
  faCalendarPlus,
  faHistory,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-hoteles',
  standalone: true,
  imports: [CommonModule, EditarHotelComponent, CrearHotelComponent, FontAwesomeModule],
  templateUrl: '../html/hoteles.component.html',
  styleUrls: ['../css/hoteles.component.css'],
})
export class HotelesComponent implements OnInit {
  // Iconos de FontAwesome
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faMapMarkerAlt = faMapMarkerAlt;
  faCity = faCity;
  faMap = faMap;
  faStar = faStar;
  faSignInAlt = faSignInAlt;
  faSignOutAlt = faSignOutAlt;
  faImage = faImage;
  faCalendarPlus = faCalendarPlus;
  faHistory = faHistory;
  faEdit = faEdit;
  faTrash = faTrash;

  titulo = 'Gestión de Hoteles';
  descripcion = 'Aquí puedes administrar los hoteles del sistema.';
  hoteles: HotelDTO[] = [];
  hotelAEditar: HotelDTO | null = null;
  mostrandoFormularioCrear = false;

  // Variables para el modal de confirmación
  mostrandoModalConfirmacion = false;
  mensajeModal = '';
  hotelAEliminar: { id: number; nombre: string } | null = null;
  tieneHabitaciones = false;

  constructor(private hotelService: HotelAdminService) {}

  ngOnInit(): void {
    this.cargarHoteles();
  }

  cargarHoteles(): void {
    this.hotelService.getHoteles().subscribe({
      next: (data) => {
        this.hoteles = data;
        console.log('Hoteles cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar hoteles:', error);
      },
    });
  }

  // Método modificado para verificar habitaciones antes de eliminar
  eliminarHotel(id: number, nombre: string): void {
    this.hotelAEliminar = { id, nombre };

    // Verificar si el hotel tiene habitaciones
    this.hotelService.verificarHabitacionesHotel(id).subscribe({
      next: (tieneHabitaciones) => {
        this.tieneHabitaciones = tieneHabitaciones;

        if (tieneHabitaciones) {
          this.mensajeModal =
            'Pueden haber habitaciones y reservas asociadas. ¿Desea eliminar este hotel?';
        } else {
          this.mensajeModal =
            'No hay habitaciones ni reservas relacionadas. ¿Desea eliminar este hotel?';
        }

        this.mostrandoModalConfirmacion = true;
      },
      error: (error) => {
        console.error('Error al verificar habitaciones:', error);
        // En caso de error, mostramos un mensaje genérico
        this.mensajeModal = '¿Desea eliminar este hotel?';
        this.mostrandoModalConfirmacion = true;
      },
    });
  }

  // Método para confirmar la eliminación usando la ruta cascade
  confirmarEliminacion(): void {
    if (this.hotelAEliminar) {
      this.hotelService.eliminarHotelCascade(this.hotelAEliminar.id).subscribe({
        next: () => {
          // Actualizar la lista de hoteles después de eliminar
          this.hoteles = this.hoteles.filter((hotel) => hotel.id !== this.hotelAEliminar!.id);
          alert(`El hotel "${this.hotelAEliminar!.nombre}" ha sido eliminado correctamente.`);
          this.cerrarModalConfirmacion();
        },
        error: (error) => {
          console.error('Error al eliminar hotel:', error);
          alert('Error al eliminar el hotel. Por favor, inténtalo de nuevo.');
          this.cerrarModalConfirmacion();
        },
      });
    }
  }

  // Método para cerrar el modal de confirmación
  cerrarModalConfirmacion(): void {
    this.mostrandoModalConfirmacion = false;
    this.hotelAEliminar = null;
    this.tieneHabitaciones = false;
    this.mensajeModal = '';
  }

  editarHotel(hotel: HotelDTO): void {
    this.hotelAEditar = hotel;
  }

  cerrarEdicion(): void {
    this.hotelAEditar = null;
  }

  guardarHotel(hotelActualizado: any): void {
    // Verificar si el objeto tiene la estructura de respuesta del servicio
    let hotelData: HotelDTO;

    if (hotelActualizado && hotelActualizado.data) {
      // Si el objeto tiene una propiedad 'data', usar esa
      hotelData = hotelActualizado.data;
    } else if (hotelActualizado && hotelActualizado.id) {
      // Si el objeto tiene directamente las propiedades del hotel
      hotelData = hotelActualizado;
    } else {
      console.error('Estructura de datos no válida:', hotelActualizado);
      alert('Error: Datos del hotel no válidos. Por favor, inténtalo de nuevo.');
      return;
    }

    // Verificar que el ID no sea undefined o null
    if (hotelData.id === undefined || hotelData.id === null) {
      console.error('ID de hotel no válido:', hotelData);
      alert('Error: ID de hotel no válido. Por favor, inténtalo de nuevo.');
      return;
    }

    // Llamar al servicio para actualizar en el backend
    this.hotelService.actualizarHotel(hotelData.id, hotelData).subscribe({
      next: (hotel) => {
        alert('Hotel actualizado correctamente.');
        this.cerrarEdicion();
        // Recargar la lista completa de hoteles para asegurar que se muestren los datos actualizados
        this.cargarHoteles();
      },
      error: (error) => {
        console.error('Error al actualizar hotel:', error);
        alert('Error al actualizar el hotel. Por favor, inténtalo de nuevo.');
      },
    });
  }

  mostrarFormularioCrear(): void {
    this.mostrandoFormularioCrear = true;
  }

  cerrarFormularioCrear(): void {
    this.mostrandoFormularioCrear = false;
  }

  hotelCreado(nuevoHotel: HotelDTO): void {
    // Cerrar el formulario de creación
    this.cerrarFormularioCrear();
    alert('Hotel creado correctamente.');
    // Recargar la lista completa de hoteles para incluir el nuevo hotel
    this.cargarHoteles();
  }
}
