import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminNavbarComponent } from './navbar/ts/navbar.component';
import { NavbarStateService } from '../admin/navbar-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-superadmin-container',
  standalone: true,
  imports: [CommonModule, RouterModule, SuperAdminNavbarComponent],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperAdminContainerComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  private subscription!: Subscription;

  constructor(private navbarStateService: NavbarStateService) {}

  ngOnInit(): void {
    this.subscription = this.navbarStateService.collapsed$.subscribe((collapsed) => {
      this.isCollapsed = collapsed;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
