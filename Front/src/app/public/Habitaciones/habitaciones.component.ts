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

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agregar FormsModule a los imports
  templateUrl: './habitaciones.html',
  styleUrls: ['./habitaciones.css'],
})
export class HabitacionesComponent implements OnInit, AfterViewInit {
  habitaciones: Habitacion[] = [];
  resenas: Resena[] = [];
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  hotel: Partial<Hotel> = {};
  currentUserId: number | null = null;

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
  }

  ngAfterViewInit(): void {
    // Inicializar el mapa después de que la vista se haya cargado
    this.initMap();
  }

  loadHabitaciones(hotelId: number): void {
    this.loading = true;
    this.error = null;

    this.hotelService.getHabitacionesByHotelId(hotelId).subscribe({
      next: (data: Habitacion[]) => {
        this.habitaciones = data;
        this.loading = false;

        // Depuración: Mostrar las coordenadas en la consola
        if (this.habitaciones.length > 0) {
          console.log('Primera habitación:', this.habitaciones[0]);
          console.log(
            'Coordenadas de la primera habitación:',
            this.habitaciones[0].latitud,
            this.habitaciones[0].longitud
          );
        }

        // Extraer información del hotel de la primera habitación
        if (this.habitaciones.length > 0) {
          this.hotel.id = this.habitaciones[0].idHotel;
          // Usar el nombre del hotel desde el DTO de habitación
          this.hotel.nombre = this.habitaciones[0].hotelNombre;
        }

        // Actualizar la posición del mapa cuando se carguen los datos
        setTimeout(() => {
          this.updateMapPosition();
        }, 100);
      },
      error: (err: any) => {
        console.error('Error al cargar habitaciones:', err);
        this.error = 'No se pudieron cargar las habitaciones. Por favor, inténtelo más tarde.';
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
          alert('Error al crear la reseña');
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
    }
  }
}
