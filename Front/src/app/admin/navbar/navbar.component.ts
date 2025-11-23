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
    { name: 'Categorías', route: '/admin/categoria/listar' },
    { name: 'Habitaciones', route: '/admin/habitacion/listar/1' }, // Ruta por defecto con hotelId = 1
    { name: 'Reservas', route: '/admin/reservas' },
    { name: 'Reseñas', route: '/admin/resenas' },
    { name: 'Perfil', route: '/admin/perfil' },
  ];
}
