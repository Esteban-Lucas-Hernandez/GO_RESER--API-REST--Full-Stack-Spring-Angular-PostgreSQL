// Interfaz para CategoriaHabitacionDTO
export interface CategoriaHabitacionDTO {
  id?: number;
  nombre: string;
  descripcion: string;
  usuarioId?: number;
}

// Interfaz para CrearHabitacionDTO
export interface CrearHabitacionDTO {
  numero: string;
  capacidad: number;
  precio: number;
  descripcion: string;
  estado: string;
  categoriaId: number;
  imagenUrl?: string;
  imagenesUrls?: string[];
}

// Interfaz para HabitacionDTO
export interface HabitacionDTO {
  idHabitacion?: number;
  idHotel?: number;
  categoria: CategoriaHabitacionDTO;
  numero: string;
  capacidad: number;
  precio: number;
  descripcion: string;
  estado: string;
  imagenUrl?: string;
  imagenesUrls?: string[];
}

// Interfaz para ImagenHabitacionDTO
export interface ImagenHabitacionDTO {
  idImagen?: number;
  idHabitacion?: number;
  urlImagen: string;
}
