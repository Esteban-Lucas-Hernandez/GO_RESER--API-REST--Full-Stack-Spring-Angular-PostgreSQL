import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <h2>Procesando inicio de sesión con Google...</h2>
      <p>Por favor, espere mientras completamos la autenticación.</p>
      <div class="spinner" *ngIf="loading"></div>
    </div>
  `,
  styleUrls: ['./google-callback.component.css'],
})
export class GoogleCallbackComponent implements OnInit {
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const userId = params['userId'];
      const email = params['email'];
      const fullName = params['fullName'];
      const fotoUrl = params['fotoUrl'];
      const success = params['success'] === 'true';

      if (success && token) {
        // Guardar el token y la información del usuario
        this.authService.saveToken(token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', fullName);
        // Guardar la URL de la foto si está presente
        if (fotoUrl) {
          localStorage.setItem('userFotoUrl', fotoUrl);
        }

        // Redirigir según el rol del usuario
        setTimeout(() => {
          const userRole = this.authService.getUserRole();
          if (userRole === 'ROLE_ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else if (userRole === 'ROLE_SUPERADMIN') {
            this.router.navigate(['/superadmin/usuarios']);
          } else {
            // Para usuarios regulares o sin rol específico
            this.router.navigate(['/public']);
          }
        }, 100);
      } else {
        // Manejar error
        console.error('Error en autenticación con Google');
        alert('La autenticación con Google falló. Por favor, inténtelo de nuevo.');
        this.router.navigate(['/login']);
      }
    });
  }
}
