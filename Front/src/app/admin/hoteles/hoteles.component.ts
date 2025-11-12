import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelAdminService } from './hotel-admin.service';
import { HotelDTO } from './hotel-admin.service';
import { EditarHotelComponent } from './editar/ts/editar-hotel.component';
import { CrearHotelComponent } from './crear/ts/crear-hotel.component';

@Component({
  selector: 'app-hoteles',
  standalone: true,
  imports: [CommonModule, EditarHotelComponent, CrearHotelComponent],
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.css'],
})
export class HotelesComponent implements OnInit {
  titulo = 'Gestión de Hoteles';
  descripcion = 'Aquí puedes administrar los hoteles del sistema.';
  hoteles: HotelDTO[] = [];
  hotelAEditar: HotelDTO | null = null;
  mostrandoFormularioCrear = false;

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

  eliminarHotel(id: number, nombre: string): void {
    // Mostrar confirmación antes de eliminar
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar el hotel "${nombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      this.hotelService.eliminarHotel(id).subscribe({
        next: () => {
          // Actualizar la lista de hoteles después de eliminar
          this.hoteles = this.hoteles.filter((hotel) => hotel.id !== id);
          alert(`El hotel "${nombre}" ha sido eliminado correctamente.`);
        },
        error: (error) => {
          console.error('Error al eliminar hotel:', error);
          alert('Error al eliminar el hotel. Por favor, inténtalo de nuevo.');
        },
      });
    }
  }

  editarHotel(hotel: HotelDTO): void {
    this.hotelAEditar = hotel;
  }

  cerrarEdicion(): void {
    this.hotelAEditar = null;
  }

  guardarHotel(hotelActualizado: HotelDTO): void {
    // Llamar al servicio para actualizar en el backend
    this.hotelService.actualizarHotel(hotelActualizado.id, hotelActualizado).subscribe({
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
