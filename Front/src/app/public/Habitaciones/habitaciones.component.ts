import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, Habitacion, Hotel, Resena } from '../hotel.service';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para el formulario

// Importaciones para Leaflet
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defaultIcon } from '../../leaflet.config';

// Importar el componente de navegación
import { NavComponent } from '../nav/nav.component';
@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent], // Agregar FormsModule y NavComponent a los imports
  templateUrl: './habitaciones.html',
  styleUrls: ['./habitaciones.css'],
})
export class HabitacionesComponent implements OnInit, AfterViewInit {
  habitaciones: Habitacion[] = [];
  habitacionesPaginadas: Habitacion[] = [];
  resenas: Resena[] = [];
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  hotel: Partial<Hotel> = {};
  currentUserId: number | null = null;

  // Variables para paginación
  currentPage = 1;
  itemsPerPage = 3; // Cambiado de 6 a 3 habitaciones por página
  totalPages = 0;

  // Variables para el modal de edición
  showEditModal = false;
  selectedResena: Resena | null = null;
  editComentario: string = '';
  editCalificacion: number = 5;

  // Variables para el modal de creación
  showCreateModal = false;
  newComentario: string = '';
  newCalificacion: number = 5;

  // Variables para el mapa
  private map: any;
  private marker: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario logueado
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = this.authService.decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        this.currentUserId = decodedToken.userId;
      }
    }

    this.route.params.subscribe((params) => {
      this.hotelId = +params['id'];
      if (this.hotelId) {
        this.loadHabitaciones(this.hotelId);
        this.loadResenas(this.hotelId);
      }
    });

    // Forzar el scroll al inicio de la página al cargar
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit(): void {
    // Inicializar el mapa después de que la vista se haya cargado
    this.initMap();
  }

  // Método para actualizar las habitaciones paginadas
  updatePaginatedRooms(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.habitacionesPaginadas = this.habitaciones.slice(startIndex, endIndex);
  }

  // Método para cambiar de página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRooms();
    }
  }

  // Método para ir a la página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  // Método para ir a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  loadHabitaciones(hotelId: number): void {
    this.loading = true;
    this.error = null;

    // Verificar que el ID del hotel sea válido
    console.log('Cargando información para el hotel ID:', hotelId);

    if (!hotelId || hotelId <= 0) {
      this.error = 'ID de hotel inválido';
      this.loading = false;
      return;
    }

    // Cargar las habitaciones del hotel (la información del hotel viene en la primera habitación)
    this.hotelService.getHabitacionesByHotelId(hotelId).subscribe({
      next: (data: Habitacion[]) => {
        console.log('Habitaciones cargadas:', data);
        this.habitaciones = data;

        // Calcular paginación
        this.totalPages = Math.ceil(this.habitaciones.length / this.itemsPerPage);
        this.updatePaginatedRooms();

        this.loading = false;

        // Extraer información del hotel de la primera habitación
        if (this.habitaciones.length > 0) {
          const primeraHabitacion = this.habitaciones[0];

          // Cargar información completa del hotel desde el endpoint específico
          if (this.hotelId) {
            this.hotelService.getHotelById(this.hotelId).subscribe({
              next: (hotelData: Hotel) => {
                this.hotel = hotelData;
              },
              error: (err: any) => {
                console.error('Error al cargar información completa del hotel:', err);
                // Fallback: usar información básica de la habitación
                this.hotel = {
                  id: primeraHabitacion.idHotel,
                  nombre: primeraHabitacion.hotelNombre,
                  email: primeraHabitacion.email,
                  descripcion: primeraHabitacion.descripcionHotel,
                  checkIn: primeraHabitacion.checkIn,
                  checkOut: primeraHabitacion.checkOut,
                  createdAt: primeraHabitacion.createdAt,
                  updatedAt: primeraHabitacion.updatedAt,
                  imagenUrl: primeraHabitacion.hotelImagenUrl,
                  estrellas: primeraHabitacion.estrellas,
                  ciudad: {
                    id: 0, // Valor por defecto
                    nombre: primeraHabitacion.ciudadNombre,
                    departamento: {
                      id: 0, // Valor por defecto
                      nombre: primeraHabitacion.departamentoNombre,
                    },
                  },
                };
              },
            });
          } else {
            // Fallback: usar información básica de la habitación
            this.hotel = {
              id: primeraHabitacion.idHotel,
              nombre: primeraHabitacion.hotelNombre,
              email: primeraHabitacion.email,
              descripcion: primeraHabitacion.descripcionHotel,
              checkIn: primeraHabitacion.checkIn,
              checkOut: primeraHabitacion.checkOut,
              createdAt: primeraHabitacion.createdAt,
              updatedAt: primeraHabitacion.updatedAt,
              imagenUrl: primeraHabitacion.hotelImagenUrl,
              estrellas: primeraHabitacion.estrellas,
              ciudad: {
                id: 0, // Valor por defecto
                nombre: primeraHabitacion.ciudadNombre,
                departamento: {
                  id: 0, // Valor por defecto
                  nombre: primeraHabitacion.departamentoNombre,
                },
              },
            };
          }
        }

        // Depuración: Mostrar las coordenadas en la consola
        if (this.habitaciones.length > 0) {
          console.log('Primera habitación:', this.habitaciones[0]);
          console.log(
            'Coordenadas de la primera habitación:',
            this.habitaciones[0].latitud,
            this.habitaciones[0].longitud
          );
        }

        // Actualizar la posición del mapa cuando se carguen los datos
        setTimeout(() => {
          this.updateMapPosition();
        }, 100);
      },
      error: (err: any) => {
        console.error('Error al cargar habitaciones:', err);
        // Proporcionar un mensaje de error más específico
        if (err.status === 404) {
          this.error = 'No se encontraron habitaciones para este hotel.';
        } else if (err.status === 0) {
          this.error =
            'No se pudo conectar con el servidor para cargar las habitaciones. Verifique que el servidor esté en ejecución.';
        } else {
          this.error = `Error al cargar las habitaciones: ${err.message || 'Error desconocido'}`;
        }
        this.loading = false;
      },
    });
  }

  loadResenas(hotelId: number): void {
    this.hotelService.getResenasByHotelId(hotelId).subscribe({
      next: (data: Resena[]) => {
        this.resenas = data;
        console.log('Reseñas cargadas:', data);
      },
      error: (err: any) => {
        console.error('Error al cargar reseñas:', err);
        // No mostramos error al usuario para las reseñas, simplemente dejamos la lista vacía
      },
    });
  }

  // Verificar si una reseña pertenece al usuario actual
  isUserReview(resena: Resena): boolean {
    return this.currentUserId !== null && resena.idUsuario === this.currentUserId;
  }

  // Abrir modal de creación
  openCreateModal(): void {
    this.newComentario = '';
    this.newCalificacion = 5;
    this.showCreateModal = true;
  }

  // Cerrar modal de creación
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  // Guardar nueva reseña
  saveNewResena(): void {
    // Validar que los datos sean correctos
    if (!this.newComentario.trim()) {
      alert('Por favor ingrese un comentario');
      return;
    }

    // Validar que la calificación esté en el rango correcto
    if (this.newCalificacion < 1 || this.newCalificacion > 5) {
      alert('La calificación debe estar entre 1 y 5');
      return;
    }

    if (this.hotelId) {
      const newResena = {
        comentario: this.newComentario,
        calificacion: this.newCalificacion,
      };

      console.log('Llamando a createResena con datos:', newResena);
      this.hotelService.createResena(this.hotelId!, newResena).subscribe({
        next: (response: Resena) => {
          // Agregar la nueva reseña a la lista
          this.resenas.push(response);

          // Cerrar el modal
          this.closeCreateModal();

          // Recargar las reseñas para asegurar que se muestra la nueva
          if (this.hotelId) {
            this.loadResenas(this.hotelId);
          }

          alert('Reseña creada correctamente');
        },
        error: (err) => {
          console.error('Error al crear reseña:', err);
          // Mostrar el mensaje de error específico del backend si está disponible
          let errorMessage = 'Error al crear la reseña';
          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          alert(errorMessage);
        },
      });
    }
  }

  // Abrir modal de edición
  editarResena(resena: Resena): void {
    this.selectedResena = resena;
    this.editComentario = resena.comentario;
    // Asegurarse de que la calificación esté en el rango válido
    this.editCalificacion =
      resena.calificacion >= 1 && resena.calificacion <= 5 ? resena.calificacion : 5;
    this.showEditModal = true;
  }

  // Cerrar modal de edición
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedResena = null;
  }

  // Guardar cambios en la reseña
  saveResenaChanges(): void {
    // Validar que los datos sean correctos
    if (!this.editComentario.trim()) {
      alert('Por favor ingrese un comentario');
      return;
    }

    // Validar que la calificación esté en el rango correcto
    if (this.editCalificacion < 1 || this.editCalificacion > 5) {
      alert('La calificación debe estar entre 1 y 5');
      return;
    }

    if (this.selectedResena) {
      const updatedResena = {
        comentario: this.editComentario,
        calificacion: this.editCalificacion,
      };

      this.hotelService.updateResena(this.selectedResena.idResena, updatedResena).subscribe({
        next: (response) => {
          // Actualizar la reseña en la lista local
          const index = this.resenas.findIndex((r) => r.idResena === this.selectedResena!.idResena);
          if (index !== -1) {
            this.resenas[index] = { ...this.resenas[index], ...updatedResena };
          }

          // Cerrar el modal
          this.closeEditModal();

          // Recargar las reseñas para asegurar que se muestran los cambios
          if (this.hotelId) {
            this.loadResenas(this.hotelId);
          }

          alert('Reseña actualizada correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar reseña:', err);
          alert('Error al actualizar la reseña');
        },
      });
    }
  }

  // Eliminar una reseña
  deleteResena(idResena: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      this.hotelService.deleteResena(idResena).subscribe({
        next: () => {
          // Eliminar la reseña de la lista local
          this.resenas = this.resenas.filter((resena) => resena.idResena !== idResena);

          // Recargar las reseñas para asegurar que se muestra el cambio
          if (this.hotelId) {
            this.loadResenas(this.hotelId);
          }

          alert('Reseña eliminada correctamente');
        },
        error: (err: any) => {
          console.error('Error al eliminar reseña:', err);
          alert('Error al eliminar la reseña');
        },
      });
    }
  }

  volverAlListado(): void {
    this.router.navigate(['/public']);
  }

  verDetalles(habitacionId: number): void {
    if (this.hotelId) {
      this.router.navigate(['/detalle-habitacion', this.hotelId, habitacionId]);
    }
  }

  // Función auxiliar para obtener una calificación válida (entre 0 y 5)
  getValidCalificacion(calificacion: number | undefined | null): number {
    if (calificacion === undefined || calificacion === null || isNaN(calificacion)) {
      return 0;
    }
    return Math.max(0, Math.min(5, Math.floor(calificacion)));
  }

  // Función auxiliar para obtener el número de estrellas vacías
  getEmptyStars(calificacion: number | undefined | null): number {
    const validCalificacion = this.getValidCalificacion(calificacion);
    return Math.max(0, 5 - validCalificacion);
  }

  // Inicializar el mapa
  private initMap(): void {
    // Crear el mapa centrado en una posición por defecto
    this.map = L.map('map').setView([4.5709, -74.2973], 6); // Coordenadas por defecto para Colombia

    // Agregar capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Usar el ícono configurado
    this.marker = L.marker([4.5709, -74.2973], { icon: defaultIcon }).addTo(this.map);
  }

  // Actualizar la posición del mapa
  private updateMapPosition(): void {
    // Verificar si tenemos los datos necesarios
    if (this.habitaciones.length > 0 && this.map && this.marker) {
      // Usar coordenadas reales de la primera habitación
      const primeraHabitacion = this.habitaciones[0];

      // Verificar si las coordenadas están disponibles
      if (primeraHabitacion.latitud && primeraHabitacion.longitud) {
        const lat = primeraHabitacion.latitud;
        const lng = primeraHabitacion.longitud;

        console.log('Usando coordenadas reales:', lat, lng);

        // Mover el mapa a la nueva posición
        this.map.setView([lat, lng], 15);

        // Mover el marcador a la nueva posición
        this.marker.setLatLng([lat, lng]);

        // Agregar un popup con información
        let hotelInfo = `Hotel ID: ${this.hotelId}`;
        if (this.hotel && this.hotel.nombre) {
          hotelInfo = this.hotel.nombre;
        }
        this.marker
          .bindPopup(`<b>${hotelInfo}</b><br>${this.habitaciones.length} habitaciones disponibles`)
          .openPopup();
      } else {
        console.log('No se encontraron coordenadas, usando posición simulada');
        // Si no tenemos coordenadas reales, simulamos una posición en Bogotá
        const lat = 4.711 + (Math.random() - 0.5) * 0.1; // Posición aleatoria cerca de Bogotá
        const lng = -74.0721 + (Math.random() - 0.5) * 0.1;

        // Mover el mapa a la nueva posición
        this.map.setView([lat, lng], 13);

        // Mover el marcador a la nueva posición
        this.marker.setLatLng([lat, lng]);

        // Agregar un popup con información
        let hotelInfo = `Hotel ID: ${this.hotelId}`;
        if (this.hotel && this.hotel.nombre) {
          hotelInfo = this.hotel.nombre;
        }
        this.marker
          .bindPopup(`<b>${hotelInfo}</b><br>${this.habitaciones.length} habitaciones disponibles`)
          .openPopup();
      }

      // Forzar la actualización del mapa
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 200);
    }
  }
}
