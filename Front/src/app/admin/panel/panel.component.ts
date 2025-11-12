import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent implements OnInit {
  panelData: any = null;
  userInfo: any = null;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Obtener la información del usuario del token
    this.loadUserInfoFromToken();
    // Cargar los datos del panel
    this.loadPanelData();
  }

  loadUserInfoFromToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = this.authService.decodeToken(token);
      if (decodedToken) {
        this.userInfo = {
          username: decodedToken.username,
          email: decodedToken.sub,
          userId: decodedToken.userId,
          roles: decodedToken.roles,
        };
      }
    }
  }

  loadPanelData(): void {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.get('http://localhost:8080/admin/dashboard', { headers }).subscribe({
        next: (data: any) => {
          this.panelData = data;
        },
        error: (error: any) => {
          console.error('Error loading panel data:', error);
        },
      });
    }
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/public']);
  }
}
