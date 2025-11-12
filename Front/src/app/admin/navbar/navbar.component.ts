import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  menuItems = [
    { name: 'Panel', route: '/admin/panel' },
    { name: 'Hoteles', route: '/admin/hoteles' },
    { name: 'Usuarios', route: '/admin/usuarios' },
    { name: 'Reservas', route: '/admin/reservas' },
  ];
}
