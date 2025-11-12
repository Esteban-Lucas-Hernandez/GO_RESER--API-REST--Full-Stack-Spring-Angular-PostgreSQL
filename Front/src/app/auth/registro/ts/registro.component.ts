import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, RegistroData } from '../../auth.service'; // Importar el servicio y el modelo

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../html/registro.component.html',
  styleUrls: ['../css/registro.component.css'],
})
export class RegistroComponent {
  registroForm: FormGroup;
  @Output() registroSuccess = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Inyectar el servicio y el router
    this.registroForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      documento: [''],
      contrasena: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      // Preparar los datos para enviar
      const formData: RegistroData = this.registroForm.value;

      // Enviar los datos al endpoint
      this.authService.registrar(formData).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);
          // Emitir el evento de éxito
          this.registroSuccess.emit(response);
        },
        error: (error: any) => {
          console.error('Error en el registro:', error);
          // Mostrar mensaje de error al usuario
          const errorMessage =
            error?.error?.message ||
            'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
          alert(errorMessage);
        },
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.registroForm.controls).forEach((key) => {
        const control = this.registroForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
