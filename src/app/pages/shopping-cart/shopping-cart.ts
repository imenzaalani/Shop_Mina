import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css',
})
export class ShoppingCart implements OnInit {
  cartItems$: Observable<CartItem[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {}

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

