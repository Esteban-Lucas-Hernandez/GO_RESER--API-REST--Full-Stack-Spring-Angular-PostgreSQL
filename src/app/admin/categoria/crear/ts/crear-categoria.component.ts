import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaService, CategoriaHabitacionDTO } from '../../categoria.service';

@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/crear-categoria.component.html',
  styleUrls: ['../css/crear-categoria.component.css'],
})
export class CrearCategoriaComponent {
  categoria: CategoriaHabitacionDTO = {
    nombre: '',
    descripcion: '',
  };
  loading = false;
  error: string | null = null;

  constructor(private router: Router, private categoriaService: CategoriaService) {}

  onSubmit(): void {
    if (!this.categoria.nombre || !this.categoria.descripcion) {
      this.error = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.categoriaService.createCategoria(this.categoria).subscribe({
      next: () => {
        this.loading = false;
        // Redirigir al listado de categorías
        this.router.navigate(['/admin/categoria/listar']);
      },
      error: (err: any) => {
        console.error('Error al crear categoría:', err);
        this.error = 'No se pudo crear la categoría. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/categoria/listar']);
  }
}
