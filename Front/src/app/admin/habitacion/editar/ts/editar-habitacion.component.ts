import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitacionService } from '../../habitacion.service';
import { CategoriaService } from '../../../categoria/categoria.service';
import { HabitacionDTO, CategoriaHabitacionDTO } from '../../habitacion.interface';

@Component({
  selector: 'app-editar-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/editar-habitacion.component.html',
  styleUrls: ['../css/editar-habitacion.component.css'],
})
export class EditarHabitacionComponent implements OnInit {
  habitacion: HabitacionDTO = {
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

  categorias: CategoriaHabitacionDTO[] = [];
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;
  habitacionId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private habitacionService: HabitacionService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId'];
      this.habitacionId = +params['id'];
      if (this.hotelId && this.habitacionId) {
        this.loadHabitacion(this.hotelId, this.habitacionId);
      }
    });

    // Cargar las categorías al inicializar el componente
    this.loadCategorias();
  }

  loadCategorias(): void {
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

  loadHabitacion(hotelId: number, habitacionId: number): void {
    this.loading = true;
    this.error = null;

    this.habitacionService.getHabitacionById(hotelId, habitacionId).subscribe({
      next: (data: HabitacionDTO) => {
        this.habitacion = data;
        // Convertir categoriaId a número si es necesario
        if (this.habitacion.categoria && this.habitacion.categoria.id) {
          this.habitacion.categoria.id = +this.habitacion.categoria.id;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar habitación:', err);
        this.error = 'No se pudo cargar la habitación. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.hotelId || !this.habitacionId) {
      this.error = 'ID de hotel o habitación no válido.';
      return;
    }

    if (!this.habitacion.numero || !this.habitacion.capacidad || !this.habitacion.precio) {
      this.error = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Asegurarse de que categoriaId sea un número
    const habitacionToUpdate: HabitacionDTO = {
      ...this.habitacion,
      categoria: {
        ...this.habitacion.categoria,
        id: this.habitacion.categoria.id ? +this.habitacion.categoria.id : undefined,
      },
    };

    this.habitacionService
      .updateHabitacion(this.hotelId, this.habitacionId, habitacionToUpdate)
      .subscribe({
        next: () => {
          this.loading = false;
          // Redirigir al listado de habitaciones
          this.router.navigate(['/admin/habitacion/listar', this.hotelId]);
        },
        error: (err: any) => {
          console.error('Error al actualizar habitación:', err);
          this.error = 'No se pudo actualizar la habitación. Por favor, inténtelo más tarde.';
          this.loading = false;
        },
      });
  }

  cancelar(): void {
    if (this.hotelId) {
      this.router.navigate(['/admin/habitacion/listar', this.hotelId]);
    }
  }
}
