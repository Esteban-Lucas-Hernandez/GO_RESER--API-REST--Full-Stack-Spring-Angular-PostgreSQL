import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent {
  titulo = 'Gestión de Reservas';
  descripcion = 'Aquí puedes administrar las reservas del sistema.';
}
