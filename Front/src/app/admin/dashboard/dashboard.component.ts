import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dashboardData: any = null;
  userInfo: any = null;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Obtener la información del usuario del token
    this.loadUserInfoFromToken();
    // Cargar los datos del dashboard
    this.loadDashboardData();
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

  loadDashboardData(): void {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.get('http://localhost:8080/admin/dashboard', { headers }).subscribe({
        next: (data: any) => {
          this.dashboardData = data;
        },
        error: (error: any) => {
          console.error('Error loading dashboard data:', error);
        },
      });
    }
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/public']);
  }
}
