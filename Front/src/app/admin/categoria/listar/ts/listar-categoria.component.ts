import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CategoriaService, CategoriaHabitacionDTO } from '../../categoria.service';

@Component({
  selector: 'app-listar-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agregar FormsModule a los imports
  templateUrl: '../html/listar-categoria.component.html',
  styleUrls: ['../css/listar-categoria.component.css'],
})
export class ListarCategoriaComponent implements OnInit {
  titulo = 'Gestión de Categorías';
  descripcion = 'Aquí puedes administrar las categorías del sistema.';
  categorias: CategoriaHabitacionDTO[] = [];
  loading = false;
  error: string | null = null;

  // Propiedades para el modal de creación
  mostrarModalCrear = false;
  nuevaCategoria: CategoriaHabitacionDTO = { nombre: '', descripcion: '' };

  // Propiedades para el modal de edición
  mostrarModalEditar = false;
  categoriaEditada: CategoriaHabitacionDTO = { nombre: '', descripcion: '' };
  categoriaEnEdicion: CategoriaHabitacionDTO | null = null;

  // Variables para el modal de confirmación
  mostrandoModalConfirmacion = false;
  mensajeModal = '';
  categoriaAEliminar: { id: number; nombre: string } | null = null;

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

  // Métodos para el modal de creación
  abrirModalCreacion(): void {
    this.nuevaCategoria = { nombre: '', descripcion: '' };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.error = null;
  }

  guardarNuevaCategoria(): void {
    if (!this.nuevaCategoria.nombre || !this.nuevaCategoria.descripcion) {
      this.error = 'Por favor, complete todos los campos.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.categoriaService.createCategoria(this.nuevaCategoria).subscribe({
      next: (categoria: CategoriaHabitacionDTO) => {
        this.categorias.push(categoria);
        this.cerrarModalCrear();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al crear categoría:', err);
        // Manejar errores de autenticación
        if (err.status === 401) {
          this.error = 'No autorizado. Por favor, inicie sesión nuevamente.';
          // Opcionalmente redirigir al login
          // this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.error = 'Acceso denegado. No tiene permisos para realizar esta acción.';
        } else {
          this.error = 'No se pudo crear la categoría. Por favor, inténtelo más tarde.';
        }
        this.loading = false;
      },
    });
  }

  // Métodos para el modal de edición
  abrirModalEdicion(categoria: CategoriaHabitacionDTO): void {
    this.categoriaEnEdicion = categoria;
    this.categoriaEditada = { ...categoria }; // Copiar los valores actuales
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.categoriaEnEdicion = null;
    this.error = null;
  }

  guardarCategoriaEditada(): void {
    if (!this.categoriaEditada.nombre || !this.categoriaEditada.descripcion) {
      this.error = 'Por favor, complete todos los campos.';
      return;
    }

    if (!this.categoriaEnEdicion) {
      this.error = 'No se ha seleccionado ninguna categoría para editar.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.categoriaService
      .updateCategoria(this.categoriaEnEdicion.id!, this.categoriaEditada)
      .subscribe({
        next: (categoriaActualizada: CategoriaHabitacionDTO) => {
          // Actualizar la categoría en la lista
          const index = this.categorias.findIndex((cat) => cat.id === this.categoriaEnEdicion!.id);
          if (index !== -1) {
            this.categorias[index] = categoriaActualizada;
          }

          this.cerrarModalEditar();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al actualizar categoría:', err);
          // Manejar errores de autenticación
          if (err.status === 401) {
            this.error = 'No autorizado. Por favor, inicie sesión nuevamente.';
            // Opcionalmente redirigir al login
            // this.router.navigate(['/login']);
          } else if (err.status === 403) {
            this.error = 'Acceso denegado. No tiene permisos para realizar esta acción.';
          } else {
            this.error = 'No se pudo actualizar la categoría. Por favor, inténtelo más tarde.';
          }
          this.loading = false;
        },
      });
  }

  // Método modificado para usar modal de confirmación
  eliminarCategoria(id: number, nombre: string): void {
    this.categoriaAEliminar = { id, nombre };
    this.mensajeModal = '¿Está seguro que desea eliminar esta categoría?';
    this.mostrandoModalConfirmacion = true;
  }

  // Método para confirmar la eliminación
  confirmarEliminacion(): void {
    if (this.categoriaAEliminar) {
      this.categoriaService.deleteCategoria(this.categoriaAEliminar.id).subscribe({
        next: () => {
          // Recargar la lista después de eliminar
          this.loadCategorias();
          alert(
            `La categoría "${this.categoriaAEliminar!.nombre}" ha sido eliminada correctamente.`
          );
          this.cerrarModalConfirmacion();
        },
        error: (err: any) => {
          console.error('Error al eliminar categoría:', err);
          // Manejar errores de autenticación
          if (err.status === 401) {
            this.error = 'No autorizado. Por favor, inicie sesión nuevamente.';
            // Opcionalmente redirigir al login
            // this.router.navigate(['/login']);
          } else if (err.status === 403) {
            this.error = 'Acceso denegado. No tiene permisos para realizar esta acción.';
          } else if (err.status === 0) {
            this.error =
              'Error de conexión. Verifique su conexión a internet o inténtelo más tarde.';
          } else {
            this.error = 'No se pudo eliminar la categoría. Por favor, inténtelo más tarde.';
          }
          alert('Error al eliminar la categoría. Por favor, inténtelo más tarde.');
          this.cerrarModalConfirmacion();
        },
      });
    }
  }

  // Método para cerrar el modal de confirmación
  cerrarModalConfirmacion(): void {
    this.mostrandoModalConfirmacion = false;
    this.categoriaAEliminar = null;
    this.mensajeModal = '';
  }
}
