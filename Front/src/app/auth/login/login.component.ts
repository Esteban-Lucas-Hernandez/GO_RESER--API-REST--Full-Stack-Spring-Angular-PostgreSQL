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
  loginError: string | null = null;

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

      // Limpiar error anterior
      this.loginError = null;

      // Enviar los datos al endpoint
      this.authService.login(formData).subscribe({
        next: (response: AuthResponse) => {
          console.log('Login exitoso:', response);

          // Verificar si el login fue realmente exitoso
          if (response && response.token && response.success !== false) {
            // Mostrar mensaje de autenticación exitosa
            alert('Autenticación exitosa');

            // Verificar que el token se haya guardado correctamente
            const token = this.authService.getToken();
            if (token) {
              console.log('Token guardado:', token);

              // Decodificar el token y obtener el rol
              const userRole = this.authService.getUserRole();
              console.log('Rol del usuario:', userRole);

              // Redirigir según el rol
              if (userRole === 'ROLE_ADMIN') {
                this.router.navigate(['/admin']);
              } else {
                // Redirigir a una página por defecto para otros roles
                this.router.navigate(['/public']);
              }
            } else {
              console.error('No se guardó el token');
            }
          } else {
            // El servidor respondió con éxito pero el login no fue exitoso
            const errorMessage =
              response?.message || 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
            alert(errorMessage);
          }
        },
        error: (error: any) => {
          console.error('Error en el login:', error);
          // Mostrar mensaje de error al usuario
          const errorMessage =
            error?.error?.message ||
            'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
          alert(errorMessage);
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
