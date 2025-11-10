import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginData, AuthResponse } from '../auth.service'; // Importar el servicio y los modelos

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Inyectar el servicio y el router
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Preparar los datos para enviar
      const formData: LoginData = this.loginForm.value;

      // Enviar los datos al endpoint
      this.authService.login(formData).subscribe({
        next: (response: AuthResponse) => {
          console.log('Login exitoso:', response);
          // El token ya se guarda automáticamente en localStorage gracias al servicio
          // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
        },
        error: (error: any) => {
          console.error('Error en el login:', error);
          // Aquí puedes mostrar un mensaje de error al usuario
        },
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goToRegistro() {
    this.router.navigate(['/registro']);
  }
}
