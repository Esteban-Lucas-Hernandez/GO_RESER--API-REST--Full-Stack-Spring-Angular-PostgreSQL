import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, RegistroData } from '../auth.service'; // Importar el servicio y el modelo

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  registroForm: FormGroup;

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
          // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
        },
        error: (error: any) => {
          console.error('Error en el registro:', error);
          // Aquí puedes mostrar un mensaje de error al usuario
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
