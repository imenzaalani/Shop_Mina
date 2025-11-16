import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart/cart.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shopping-cart-overlay',
  imports: [DecimalPipe, AsyncPipe, RouterModule],
  templateUrl: './shopping-cart-overlay.html',
  styleUrl: './shopping-cart-overlay.css',
})
export class ShoppingCartOverlay implements OnInit {
  @Output() close = new EventEmitter<void>();
  isVisible = false;
  isCartEmpty = true;
  cartItems$: Observable<CartItem[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit() {
    setTimeout(() => this.isVisible = true, 10); // allow DOM to render before showing
    this.cartItems$.subscribe(items => {
      this.isCartEmpty = items.length === 0;
    });
  }

  onClose() {
    this.isVisible = false;
    setTimeout(() => this.close.emit(), 300); // match CSS transition duration
  }

  getSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.regularPrice || item.product.currentPrice;
      return sum + price * item.quantity;
    }, 0);
  }

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }
}
