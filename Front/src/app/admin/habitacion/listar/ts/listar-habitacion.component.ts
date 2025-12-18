import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../../habitacion.service';
import { HotelAdminService } from '../../../hoteles/hotel-admin.service';
import { HabitacionDTO, CrearHabitacionDTO } from '../../habitacion.interface';
import { HotelDTO } from '../../../hoteles/hotel-admin.service';
import { CategoriaHabitacionDTO } from '../../../categoria/categoria.service';
import { filter } from 'rxjs/operators';
import { CategoriaService } from '../../../categoria/categoria.service'; // Importar CategoriaService

@Component({
  selector: 'app-listar-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/listar-habitacion.component.html',
  styleUrls: ['../css/listar-habitacion.component.css'],
})
export class ListarHabitacionComponent implements OnInit {
  titulo = 'Gestión de Habitaciones';
  descripcion = 'Si quiere editar o eliminar un hotel por favor seleccione primero en el filtro';
  habitaciones: HabitacionDTO[] = [];
  hoteles: HotelDTO[] = [];
  categorias: CategoriaHabitacionDTO[] = []; // Arreglar la carga de categorías
  loading = false;
  error: string | null = null;
  errorModal: string | null = null;
  hotelId: number | null = 0;

  // Propiedades para el modal de creación
  mostrarModalCrear = false;
  nuevaHabitacion: CrearHabitacionDTO = {
    numero: '',
    capacidad: 0,
    precio: 0,
    descripcion: '',
    estado: 'disponible',
    categoriaId: 0,
    imagenUrl: '',
    imagenesUrls: [],
  };

  // Propiedades para el modal de edición
  mostrarModalEditar = false;
  habitacionEditada: HabitacionDTO = {
    idHabitacion: undefined,
    idHotel: undefined,
    categoria: {
      id: undefined,
      nombre: '',
      descripcion: '',
      usuarioId: undefined,
    },
    numero: '',
    capacidad: 0,
    precio: 0,
    descripcion: '',
    estado: 'disponible',
    imagenUrl: '',
    imagenesUrls: [],
  };
  habitacionEnEdicion: HabitacionDTO | null = null;

  // Variables para el modal de confirmación
  mostrandoModalConfirmacion = false;
  mensajeModal = '';
  habitacionAEliminar: { id: number; numero: string } | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private habitacionService: HabitacionService,
    private hotelService: HotelAdminService,
    private categoriaService: CategoriaService // Inyectar CategoriaService
  ) {}

  ngOnInit(): void {
    // Cargar la lista de hoteles
    this.loadHoteles();

    // Cargar categorías
    this.loadCategorias();

    // Cargar todas las habitaciones por defecto
    this.loadTodasLasHabitaciones();

    // Verificar si hay un hotelId en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      if (params['hotelId']) {
        this.hotelId = +params['hotelId'];
        this.loadHabitaciones(this.hotelId);
      }
    });

    // Suscribirse a los eventos de navegación para recargar cuando se entre al componente
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // Si estamos en la ruta base de listado de habitaciones, recargar todas
      if (this.router.url === '/admin/habitacion/listar') {
        this.hotelId = 0;
        this.loadTodasLasHabitaciones();
      }
    });
  }

  loadHoteles(): void {
    this.hotelService.getHoteles().subscribe({
      next: (data: HotelDTO[]) => {
        this.hoteles = data;
      },
      error: (err: any) => {
        console.error('Error al cargar hoteles:', err);
        this.error = 'No se pudieron cargar los hoteles. Por favor, inténtelo más tarde.';
      },
    });
  }

  loadCategorias(): void {
    // Cargar las categorías usando el servicio
    this.categoriaService.getCategorias().subscribe({
      next: (data: CategoriaHabitacionDTO[]) => {
        this.categorias = data;
      },
      error: (err: any) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías. Por favor, inténtelo más tarde.';
      },
    });
  }

  loadTodasLasHabitaciones(): void {
    this.loading = true;
    this.error = null;

    this.habitacionService.getTodasLasHabitaciones().subscribe({
      next: (data: HabitacionDTO[]) => {
        this.habitaciones = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar habitaciones:', err);
        this.error = 'No se pudieron cargar las habitaciones. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  loadHabitaciones(hotelId: number): void {
    this.loading = true;
    this.error = null;

    this.habitacionService.getHabitacionesByHotelId(hotelId).subscribe({
      next: (data: HabitacionDTO[]) => {
        this.habitaciones = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar habitaciones:', err);
        this.error = 'No se pudieron cargar las habitaciones. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  onHotelChange(event: any): void {
    const selectedHotelId = +event.target.value;
    if (selectedHotelId > 0) {
      this.hotelId = selectedHotelId;
      this.router.navigate(['/admin/habitacion/listar', selectedHotelId]);
    } else {
      // Si se selecciona la opción "Todos los hoteles" (0), cargar todas las habitaciones
      this.hotelId = 0;
      this.loadTodasLasHabitaciones();
    }
  }

  getHotelName(hotelId: number | undefined): string {
    if (!hotelId) return 'N/A';
    const hotel = this.hoteles.find((h) => h.id === hotelId);
    return hotel ? hotel.nombre : 'Hotel no encontrado';
  }

  verImagenes(habitacionId: number): void {
    if (this.hotelId) {
      this.router.navigate(['/admin/habitacion/imagenes', this.hotelId, habitacionId]);
    } else {
      // Si no hay hotelId específico, necesitamos encontrar a qué hotel pertenece la habitación
      const habitacion = this.habitaciones.find((h) => h.idHabitacion === habitacionId);
      if (habitacion && habitacion.idHotel) {
        this.router.navigate(['/admin/habitacion/imagenes', habitacion.idHotel, habitacionId]);
      } else {
        alert('No se puede determinar el hotel de la habitación seleccionada.');
      }
    }
  }

  // Métodos para el modal de creación
  abrirModalCreacion(): void {
    if (!this.hotelId || this.hotelId === 0) {
      alert('Por favor, seleccione un hotel primero.');
      return;
    }

    // Resetear el formulario de nueva habitación
    this.nuevaHabitacion = {
      numero: '',
      capacidad: 0,
      precio: 0,
      descripcion: '',
      estado: 'disponible',
      categoriaId: 0,
      imagenUrl: '',
      imagenesUrls: [],
    };
    this.mostrarModalCrear = true;
    this.errorModal = null;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.errorModal = null;
  }

  guardarNuevaHabitacion(): void {
    if (!this.hotelId || this.hotelId === 0) {
      this.errorModal = 'ID de hotel no válido.';
      return;
    }

    if (
      !this.nuevaHabitacion.numero ||
      !this.nuevaHabitacion.capacidad ||
      !this.nuevaHabitacion.precio ||
      !this.nuevaHabitacion.categoriaId
    ) {
      this.errorModal = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.errorModal = null;

    this.habitacionService.createHabitacion(this.hotelId, this.nuevaHabitacion).subscribe({
      next: (habitacion: HabitacionDTO) => {
        // Agregar la nueva habitación a la lista
        this.habitaciones.push(habitacion);
        this.cerrarModalCrear();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al crear habitación:', err);
        this.errorModal = 'No se pudo crear la habitación. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  // Métodos para el modal de edición
  abrirModalEdicion(habitacion: HabitacionDTO): void {
    this.habitacionEnEdicion = habitacion;
    // Copiar los valores actuales para edición
    this.habitacionEditada = {
      ...habitacion,
      categoria: {
        ...habitacion.categoria,
      },
    };
    this.mostrarModalEditar = true;
    this.errorModal = null;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.habitacionEnEdicion = null;
    this.errorModal = null;
  }

  guardarHabitacionEditada(): void {
    if (!this.hotelId || this.hotelId === 0 || !this.habitacionEnEdicion) {
      this.errorModal = 'ID de hotel o habitación no válido.';
      return;
    }

    if (
      !this.habitacionEditada.numero ||
      !this.habitacionEditada.capacidad ||
      !this.habitacionEditada.precio
    ) {
      this.errorModal = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.errorModal = null;

    // Asegurarse de que categoriaId sea un número
    const habitacionToUpdate: HabitacionDTO = {
      ...this.habitacionEditada,
      categoria: {
        ...this.habitacionEditada.categoria,
        id: this.habitacionEditada.categoria.id ? +this.habitacionEditada.categoria.id : undefined,
      },
    };

    this.habitacionService
      .updateHabitacion(this.hotelId, this.habitacionEnEdicion.idHabitacion!, habitacionToUpdate)
      .subscribe({
        next: (habitacionActualizada: HabitacionDTO) => {
          // Actualizar la habitación en la lista
          const index = this.habitaciones.findIndex(
            (h) => h.idHabitacion === this.habitacionEnEdicion!.idHabitacion
          );
          if (index !== -1) {
            this.habitaciones[index] = habitacionActualizada;
          }

          this.cerrarModalEditar();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al actualizar habitación:', err);
          this.errorModal = 'No se pudo actualizar la habitación. Por favor, inténtelo más tarde.';
          this.loading = false;
        },
      });
  }

  // Método modificado para usar modal de confirmación
  eliminarHabitacion(id: number, numero: string): void {
    this.habitacionAEliminar = { id, numero };
    this.mensajeModal = '¿Está seguro que desea eliminar esta habitación?';
    this.mostrandoModalConfirmacion = true;
  }

  // Método para confirmar la eliminación
  confirmarEliminacion(): void {
    if (this.habitacionAEliminar) {
      const habitacionId = this.habitacionAEliminar.id;

      if (this.hotelId && this.hotelId > 0) {
        this.habitacionService.deleteHabitacion(this.hotelId, habitacionId).subscribe({
          next: () => {
            // Recargar la lista después de eliminar
            if (this.hotelId && this.hotelId > 0) {
              this.loadHabitaciones(this.hotelId);
            } else {
              this.loadTodasLasHabitaciones();
            }
            alert(
              `La habitación "${this.habitacionAEliminar!.numero}" ha sido eliminada correctamente.`
            );
            this.cerrarModalConfirmacion();
          },
          error: (err: any) => {
            console.error('Error al eliminar habitación:', err);
            this.error = 'No se pudo eliminar la habitación. Por favor, inténtelo más tarde.';
            alert('Error al eliminar la habitación. Por favor, inténtelo más tarde.');
            this.cerrarModalConfirmacion();
          },
        });
      } else {
        // Si no hay hotelId específico, necesitamos encontrar a qué hotel pertenece la habitación
        const habitacion = this.habitaciones.find((h) => h.idHabitacion === habitacionId);
        if (habitacion && habitacion.idHotel) {
          this.habitacionService.deleteHabitacion(habitacion.idHotel, habitacionId).subscribe({
            next: () => {
              // Recargar la lista después de eliminar
              this.loadTodasLasHabitaciones();
              alert(
                `La habitación "${
                  this.habitacionAEliminar!.numero
                }" ha sido eliminada correctamente.`
              );
              this.cerrarModalConfirmacion();
            },
            error: (err: any) => {
              console.error('Error al eliminar habitación:', err);
              this.error = 'No se pudo eliminar la habitación. Por favor, inténtelo más tarde.';
              alert('Error al eliminar la habitación. Por favor, inténtelo más tarde.');
              this.cerrarModalConfirmacion();
            },
          });
        } else {
          alert('No se puede determinar el hotel de la habitación seleccionada.');
          this.cerrarModalConfirmacion();
        }
      }
    }
  }

  // Método para cerrar el modal de confirmación
  cerrarModalConfirmacion(): void {
    this.mostrandoModalConfirmacion = false;
    this.habitacionAEliminar = null;
    this.mensajeModal = '';
  }

  volverAHotel(): void {
    this.router.navigate(['/admin/hoteles']);
  }
}
