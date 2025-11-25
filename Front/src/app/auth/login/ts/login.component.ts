import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginData, AuthResponse } from '../../auth.service'; // Importar el servicio y los modelos

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../html/login.component.html',
  styleUrls: ['../css/login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  @Output() loginSuccess = new EventEmitter<AuthResponse>();

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
      // Enviar los datos al endpoint
      this.authService.login(formData).subscribe({
        next: (response: AuthResponse) => {
          console.log('Login exitoso:', response);

          // Verificar si el login fue realmente exitoso
          if (response && response.token && response.success !== false) {
            // Emitir el evento de éxito
            this.loginSuccess.emit(response);

            // Redirigir según el rol del usuario
            const userRole = this.authService.getUserRole();
            console.log('Rol del usuario:', userRole);
            if (userRole === 'ROLE_SUPERADMIN') {
              this.router.navigate(['/superadmin']);
            } else if (userRole === 'ROLE_ADMIN') {
              this.router.navigate(['/admin/panel']);
            } else {
              this.router.navigate(['/public']);
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

  // Método para iniciar sesión con Google
  loginWithGoogle() {
    // Redirigir al endpoint de autenticación de Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
