import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css',
})
export class NavbarAdmin {
  @Output() collapsedChange = new EventEmitter<boolean>();
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }
}
