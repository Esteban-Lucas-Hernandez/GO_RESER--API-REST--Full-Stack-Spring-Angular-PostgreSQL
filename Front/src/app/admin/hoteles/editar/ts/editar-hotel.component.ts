import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HotelAdminService, HotelDTO, Departamento, Ciudad } from '../../hotel-admin.service';

@Component({
  selector: 'app-editar-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../html/editar-hotel.component.html',
  styleUrls: ['../css/editar-hotel.component.css'],
})
export class EditarHotelComponent implements OnInit {
  @Input() hotel!: HotelDTO;
  @Output() cerrado = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<HotelDTO>();

  hotelForm!: FormGroup;
  departamentos: Departamento[] = [];
  ciudades: Ciudad[] = [];

  constructor(private fb: FormBuilder, private hotelService: HotelAdminService) {}

  ngOnInit(): void {
    this.hotelForm = this.fb.group({
      id: [this.hotel.id],
      nombre: [this.hotel.nombre, Validators.required],
      direccion: [this.hotel.direccion, Validators.required],
      telefono: [this.hotel.telefono, Validators.required],
      email: [this.hotel.email, [Validators.required, Validators.email]],
      descripcion: [this.hotel.descripcion, Validators.required],
      estrellas: [this.hotel.estrellas, Validators.required],
      politicaCancelacion: [this.hotel.politicaCancelacion, Validators.required],
      checkIn: [this.hotel.checkIn, Validators.required],
      checkOut: [this.hotel.checkOut, Validators.required],
      imagenUrl: [this.hotel.imagenUrl],
      departamentoId: ['', Validators.required],
      ciudadId: ['', Validators.required],
    });

    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.hotelService.getDepartamentos().subscribe({
      next: (data: Departamento[]) => {
        this.departamentos = data;
        // Si estamos editando un hotel, seleccionar el departamento correspondiente
        if (this.hotel.id) {
          const dept = this.departamentos.find((d) => d.nombre === this.hotel.departamentoNombre);
          if (dept) {
            this.hotelForm.patchValue({ departamentoId: dept.id });
            this.cargarCiudades(dept.id);
          }
        }
      },
      error: (error: any) => {
        console.error('Error al cargar departamentos:', error);
      },
    });
  }

  cargarCiudades(departamentoId: number): void {
    this.hotelService.getCiudadesPorDepartamento(departamentoId).subscribe({
      next: (data: Ciudad[]) => {
        this.ciudades = data;
        // Si estamos editando un hotel, seleccionar la ciudad correspondiente
        if (this.hotel.id) {
          const ciudad = this.ciudades.find((c) => c.nombre === this.hotel.ciudadNombre);
          if (ciudad) {
            this.hotelForm.patchValue({ ciudadId: ciudad.id });
          }
        }
      },
      error: (error: any) => {
        console.error('Error al cargar ciudades:', error);
      },
    });
  }

  onDepartamentoChange(event: any): void {
    const departamentoId = event.target.value;
    if (departamentoId) {
      this.cargarCiudades(Number(departamentoId));
      // Limpiar la selección de ciudad
      this.hotelForm.patchValue({ ciudadId: '' });
    } else {
      this.ciudades = [];
      this.hotelForm.patchValue({ ciudadId: '' });
    }
  }

  onSubmit(): void {
    if (this.hotelForm.valid) {
      // Obtener los nombres de departamento y ciudad seleccionados
      const departamentoId = this.hotelForm.get('departamentoId')?.value;
      const ciudadId = this.hotelForm.get('ciudadId')?.value;

      const departamento = this.departamentos.find((d) => d.id === Number(departamentoId));
      const ciudad = this.ciudades.find((c) => c.id === Number(ciudadId));

      // Crear una copia del formulario sin los campos temporales
      const formValue = { ...this.hotelForm.value };
      delete formValue.departamentoId;
      delete formValue.ciudadId;

      const hotelActualizado: HotelDTO = {
        ...formValue,
        departamentoNombre: departamento ? departamento.nombre : '',
        ciudadNombre: ciudad ? ciudad.nombre : '',
      };

      // Llamar al servicio para actualizar el hotel
      this.hotelService.actualizarHotel(hotelActualizado.id, hotelActualizado).subscribe({
        next: (hotel: HotelDTO) => {
          this.guardado.emit(hotel);
          this.cerrar();
        },
        error: (error: any) => {
          console.error('Error al actualizar hotel:', error);
          alert('Error al actualizar el hotel. Por favor, inténtalo de nuevo.');
        },
      });
    } else {
      console.log('Formulario inválido:', this.hotelForm.errors);
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.hotelForm.controls).forEach((key) => {
        const control = this.hotelForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cerrar(): void {
    this.cerrado.emit();
  }
}
