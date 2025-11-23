import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-superadmin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class SuperAdminNavbarComponent {
  menuItems = [
    { name: 'Usuarios', route: '/superadmin/usuarios' },
    { name: 'Hoteles', route: '/superadmin/hoteles' },
    { name: 'Perfil', route: '/superadmin/perfil' },
  ];
}
