import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminHotel } from '../hoteles.service';
import { SuperAdminHotelService } from '../hoteles.service';

@Component({
  selector: 'app-superadmin-hoteles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.css'],
})
export class SuperAdminHotelesComponent implements OnInit {
  hoteles: SuperAdminHotel[] = [];
  loading = false;
  error: string | null = null;

  constructor(private hotelService: SuperAdminHotelService) {}

  ngOnInit(): void {
    this.loadHoteles();
  }

  loadHoteles(): void {
    this.loading = true;
    this.error = null;

    this.hotelService.getHoteles().subscribe({
      next: (data: SuperAdminHotel[]) => {
        this.hoteles = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar hoteles:', err);
        this.error = 'Error al cargar la lista de hoteles';
        this.loading = false;
      },
    });
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
  }
}
