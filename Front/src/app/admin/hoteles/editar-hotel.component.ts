import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HotelAdminService, HotelDTO } from './hotel-admin.service';

@Component({
  selector: 'app-editar-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="cerrar()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Editar Hotel</h2>
          <button class="close-btn" (click)="cerrar()">×</button>
        </div>
        <div class="modal-body">
          <form [formGroup]="hotelForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" formControlName="nombre" class="form-control" />
            </div>

            <div class="form-group">
              <label for="direccion">Dirección:</label>
              <input type="text" id="direccion" formControlName="direccion" class="form-control" />
            </div>

            <div class="form-group">
              <label for="telefono">Teléfono:</label>
              <input type="text" id="telefono" formControlName="telefono" class="form-control" />
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" formControlName="email" class="form-control" />
            </div>

            <div class="form-group">
              <label for="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                formControlName="descripcion"
                class="form-control"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="estrellas">Estrellas:</label>
              <select id="estrellas" formControlName="estrellas" class="form-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div class="form-group">
              <label for="politicaCancelacion">Política de Cancelación:</label>
              <input
                type="text"
                id="politicaCancelacion"
                formControlName="politicaCancelacion"
                class="form-control"
              />
            </div>

            <div class="form-row">
              <div class="form-group half-width">
                <label for="checkIn">Check In:</label>
                <input type="time" id="checkIn" formControlName="checkIn" class="form-control" />
              </div>

              <div class="form-group half-width">
                <label for="checkOut">Check Out:</label>
                <input type="time" id="checkOut" formControlName="checkOut" class="form-control" />
              </div>
            </div>

            <div class="form-group">
              <label for="imagenUrl">URL de Imagen:</label>
              <input type="text" id="imagenUrl" formControlName="imagenUrl" class="form-control" />
            </div>

            <div class="form-group">
              <label for="departamentoNombre">Departamento:</label>
              <input
                type="text"
                id="departamentoNombre"
                formControlName="departamentoNombre"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="ciudadNombre">Ciudad:</label>
              <input
                type="text"
                id="ciudadNombre"
                formControlName="ciudadNombre"
                class="form-control"
              />
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="cerrar()">Cancelar</button>
              <button type="submit" class="btn-save" [disabled]="hotelForm.invalid">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
      }

      .modal-header h2 {
        margin: 0;
        color: #333;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-btn:hover {
        color: #333;
      }

      .modal-body {
        padding: 20px;
      }

      .form-group {
        margin-bottom: 15px;
      }

      .form-row {
        display: flex;
        gap: 15px;
      }

      .half-width {
        flex: 1;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #555;
      }

      .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
      }

      .form-control:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      textarea.form-control {
        resize: vertical;
        min-height: 80px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }

      .btn-cancel {
        background-color: #6c757d;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .btn-cancel:hover {
        background-color: #5a6268;
      }

      .btn-save {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .btn-save:hover:not(:disabled) {
        background-color: #0056b3;
      }

      .btn-save:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      @media (max-width: 768px) {
        .modal-content {
          width: 95%;
          margin: 10px;
        }

        .form-row {
          flex-direction: column;
          gap: 0;
        }
      }
    `,
  ],
})
export class EditarHotelComponent implements OnInit {
  @Input() hotel!: HotelDTO;
  @Output() cerrado = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<HotelDTO>();

  hotelForm!: FormGroup;

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
      departamentoNombre: [this.hotel.departamentoNombre, Validators.required],
      ciudadNombre: [this.hotel.ciudadNombre, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.hotelForm.valid) {
      const hotelActualizado: HotelDTO = this.hotelForm.value;

      // Llamar al servicio para actualizar el hotel
      this.hotelService.actualizarHotel(hotelActualizado.id, hotelActualizado).subscribe({
        next: (hotel) => {
          this.guardado.emit(hotel);
          this.cerrar();
        },
        error: (error) => {
          console.error('Error al actualizar hotel:', error);
          alert('Error al actualizar el hotel. Por favor, inténtalo de nuevo.');
        },
      });
    }
  }

  cerrar(): void {
    this.cerrado.emit();
  }
}
