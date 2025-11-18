import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, Habitacion, Hotel } from '../hotel.service';

// Importaciones para Leaflet
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defaultIcon } from '../../leaflet.config';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habitaciones.html',
  styleUrls: ['./habitaciones.css'],
})
export class HabitacionesComponent implements OnInit, AfterViewInit {
  habitaciones: Habitacion[] = [];
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  hotel: Partial<Hotel> = {}; // Usamos Partial para permitir propiedades parciales

  // Variables para el mapa
  private map: any;
  private marker: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['id'];
      if (this.hotelId) {
        this.loadHabitaciones(this.hotelId);
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

  volverAlListado(): void {
    this.router.navigate(['/public']);
  }

  verDetalles(habitacionId: number): void {
    if (this.hotelId) {
      this.router.navigate(['/detalle-habitacion', this.hotelId, habitacionId]);
    }
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
