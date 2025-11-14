import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [RouterLink,NgClass],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css',
})

export class NavbarAdmin {
  @Output() collapsedChange = new EventEmitter<boolean>();
  isCollapsed: boolean = false;
  showAudienceDropdown: boolean = false;
  showIncomeDropdown: boolean = false;
  showPromoteDropdown: boolean = false;
  showProductsDropdown: boolean = false;
  showOrdersDropdown: boolean = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  toggleAudienceDropdown() {
    this.showAudienceDropdown = !this.showAudienceDropdown;
    // Close other dropdowns when opening this one
    this.showIncomeDropdown = false;
    this.showPromoteDropdown = false;
  }

  toggleIncomeDropdown() {
    this.showIncomeDropdown = !this.showIncomeDropdown;
    // Close other dropdowns when opening this one
    this.showAudienceDropdown = false;
    this.showPromoteDropdown = false;
  }

  togglePromoteDropdown() {
    this.showPromoteDropdown = !this.showPromoteDropdown;
    // Close other dropdowns when opening this one
    this.showAudienceDropdown = false;
    this.showIncomeDropdown = false;
  }

  toggleProductsDropdown() {
    this.showProductsDropdown = !this.showProductsDropdown;
    // Optionally close other dropdowns if needed
  }

  toggleOrdersDropdown() {
    this.showOrdersDropdown = !this.showOrdersDropdown;
    // Optionally close other dropdowns if needed
  }
}
