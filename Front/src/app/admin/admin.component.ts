import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarStateService } from './navbar-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
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
