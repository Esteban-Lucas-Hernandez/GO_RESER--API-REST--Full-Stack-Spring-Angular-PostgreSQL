import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriaService, CategoriaHabitacionDTO } from '../../categoria.service';

@Component({
  selector: 'app-listar-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../html/listar-categoria.component.html',
  styleUrls: ['../css/listar-categoria.component.css'],
})
export class ListarCategoriaComponent implements OnInit {
  titulo = 'Gestión de Categorías';
  descripcion = 'Aquí puedes administrar las categorías del sistema.';
  categorias: CategoriaHabitacionDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private router: Router, private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading = true;
    this.error = null;

    this.categoriaService.getCategorias().subscribe({
      next: (data: CategoriaHabitacionDTO[]) => {
        this.categorias = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías. Por favor, inténtelo más tarde.';
        this.loading = false;
      },
    });
  }

  crearCategoria(): void {
    this.router.navigate(['/admin/categoria/crear']);
  }

  editarCategoria(id: number): void {
    this.router.navigate(['/admin/categoria/editar', id]);
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          // Recargar la lista después de eliminar
          this.loadCategorias();
        },
        error: (err: any) => {
          console.error('Error al eliminar categoría:', err);
          this.error = 'No se pudo eliminar la categoría. Por favor, inténtelo más tarde.';
        },
      });
    }
  }
}
