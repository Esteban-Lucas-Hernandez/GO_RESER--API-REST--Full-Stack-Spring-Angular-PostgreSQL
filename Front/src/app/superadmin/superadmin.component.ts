import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminNavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-superadmin-container',
  standalone: true,
  imports: [CommonModule, RouterModule, SuperAdminNavbarComponent],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperAdminContainerComponent {}
