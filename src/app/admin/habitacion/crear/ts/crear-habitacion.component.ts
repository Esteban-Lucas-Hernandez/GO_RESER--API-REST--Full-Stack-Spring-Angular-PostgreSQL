import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitacionService } from '../../habitacion.service';
import { CategoriaService } from '../../../categoria/categoria.service';
import { CrearHabitacionDTO, CategoriaHabitacionDTO } from '../../habitacion.interface';

@Component({
  selector: 'app-crear-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/crear-habitacion.component.html',
  styleUrls: ['../css/crear-habitacion.component.css'],
})
export class CrearHabitacionComponent implements OnInit {
  habitacion: CrearHabitacionDTO = {
    numero: '',
    capacidad: 0,
    precio: 0,
    descripcion: '',
    estado: 'disponible',
    categoriaId: 0,
    imagenUrl: '',
    imagenesUrls: [],
  };

  categorias: CategoriaHabitacionDTO[] = [];
  loading = false;
  error: string | null = null;
  hotelId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private habitacionService: HabitacionService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId'];
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

  onSubmit(): void {
    if (!this.hotelId) {
      this.error = 'ID de hotel no válido.';
      return;
    }

    if (
      !this.habitacion.numero ||
      !this.habitacion.capacidad ||
      !this.habitacion.precio ||
      !this.habitacion.categoriaId
    ) {
      this.error = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.habitacionService.createHabitacion(this.hotelId, this.habitacion).subscribe({
      next: () => {
        this.loading = false;
        // Redirigir al listado de habitaciones
        this.router.navigate(['/admin/habitacion/listar', this.hotelId]);
      },
      error: (err: any) => {
        console.error('Error al crear habitación:', err);
        this.error = 'No se pudo crear la habitación. Por favor, inténtelo más tarde.';
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
