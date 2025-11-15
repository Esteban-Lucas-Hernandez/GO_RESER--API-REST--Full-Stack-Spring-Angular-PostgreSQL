import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ImagenHabitacionService } from '../../imagen-habitacion.service';
import { ImagenHabitacionDTO } from '../../habitacion.interface';

@Component({
  selector: 'app-listar-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/listar-habitaciones.component.html',
  styleUrls: ['../css/listar-habitaciones.component.css'],
})
export class ListarHabitacionesComponent implements OnInit {
  titulo = 'Imágenes de Habitación';
  descripcion = 'Gestión de imágenes para la habitación seleccionada.';
  imagenes: ImagenHabitacionDTO[] = [];
  nuevaImagen: ImagenHabitacionDTO = {
    urlImagen: '',
  };
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  habitacionId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imagenHabitacionService: ImagenHabitacionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId'];
      this.habitacionId = +params['habitacionId'];
      if (this.hotelId && this.habitacionId) {
        this.loadImagenes(this.hotelId, this.habitacionId);
      }
    });
  }

  loadImagenes(hotelId: number, habitacionId: number): void {
    this.loading = true;
    this.error = null;

    this.imagenHabitacionService.getImagenesByHabitacionId(hotelId, habitacionId).subscribe({
      next: (data: ImagenHabitacionDTO[]) => {
        this.imagenes = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar imágenes:', err);
        this.error = 'No se pudieron cargar las imágenes. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.hotelId && this.habitacionId && this.nuevaImagen.urlImagen) {
      this.loading = true;
      this.error = null;

      const imagenParaCrear: ImagenHabitacionDTO = {
        ...this.nuevaImagen,
        idHabitacion: this.habitacionId,
      };

      this.imagenHabitacionService
        .createImagen(this.hotelId, this.habitacionId, imagenParaCrear)
        .subscribe({
          next: (data: ImagenHabitacionDTO) => {
            // Añadir la nueva imagen a la lista
            this.imagenes.push(data);
            // Limpiar el formulario
            this.nuevaImagen.urlImagen = '';
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Error al crear imagen:', err);
            this.error = 'No se pudo crear la imagen. Por favor, inténtelo más tarde.';
            this.loading = false;
          },
        });
    }
  }

  eliminarImagen(imagenId: number): void {
    if (
      this.hotelId &&
      this.habitacionId &&
      confirm('¿Está seguro que desea eliminar esta imagen?')
    ) {
      this.imagenHabitacionService
        .deleteImagen(this.hotelId, this.habitacionId, imagenId)
        .subscribe({
          next: () => {
            // Recargar la lista después de eliminar
            this.loadImagenes(this.hotelId!, this.habitacionId!);
          },
          error: (err: any) => {
            console.error('Error al eliminar imagen:', err);
            this.error = 'No se pudo eliminar la imagen. Por favor, inténtelo más tarde.';
          },
        });
    }
  }

  volverAHabitacion(): void {
    if (this.hotelId) {
      this.router.navigate(['/admin/habitacion/listar', this.hotelId]);
    }
  }
}
