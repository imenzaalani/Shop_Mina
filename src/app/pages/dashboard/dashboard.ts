import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarAdmin } from '../../components/navbar-admin/navbar-admin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarAdmin],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isSidebarCollapsed = false;

  onCollapsedChange(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
}
