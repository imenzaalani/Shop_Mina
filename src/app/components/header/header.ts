import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchOverlay } from '../search-overlay/search-overlay';
import { ShoppingCartOverlay } from '../shopping-cart-overlay/shopping-cart-overlay';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchOverlay, ShoppingCartOverlay],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isDropdownOpen = false;
  isUserDropdownOpen = false;
  showSearchOverlay = false;
  showCartOverlay = false;
  firstName: string | null = null;
  lastName: string | null = null;
  cartCount = 0;
  wishlistCount = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.loadUserNames();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserNames();
    });
    this.cartService.cartItems$.subscribe((items: any[]) => {
      this.cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    });
    this.wishlistService.wishlist$.subscribe((items: any[]) => {
      this.wishlistCount = items.length;
    });
  }

  loadUserNames() {
    const userJson = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.firstName = user.firstName || null;
      this.lastName = user.lastName || null;
    } else {
      this.firstName = null;
      this.lastName = null;
    }
  }

  isLoggedIn(): boolean {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('lastName');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    this.firstName = null;
    this.lastName = null;
    window.location.href = '/login';
  }

  onDropdownEnter() {
    this.isDropdownOpen = true;
    this.isUserDropdownOpen = false;
  }

  onDropdownLeave() {
    this.isDropdownOpen = false;
  }

  onUserDropdownEnter() {
    this.isUserDropdownOpen = true;
    this.isDropdownOpen = false;
  }

  onUserDropdownLeave() {
    this.isUserDropdownOpen = false;
  }

  openSearchOverlay() {
    this.showSearchOverlay = true;
  }

  toggleCartOverlay() {
    this.showCartOverlay = !this.showCartOverlay;
  }
}
