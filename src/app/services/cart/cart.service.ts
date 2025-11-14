import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: any; // Replace 'any' with your Product type if available
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: CartItem) {
    const items = this.cartItemsSubject.value;
    // Check if item with same product, color, and size exists
    const existingIndex = items.findIndex(
      i => i.product._id === item.product._id &&
           i.selectedColor === item.selectedColor &&
           i.selectedSize === item.selectedSize
    );
    if (existingIndex > -1) {
      // Update quantity
      items[existingIndex].quantity += item.quantity;
      this.cartItemsSubject.next([...items]);
    } else {
      this.cartItemsSubject.next([...items, item]);
    }
  }

  removeFromCart(index: number) {
    const items = [...this.cartItemsSubject.value];
    items.splice(index, 1);
    this.cartItemsSubject.next(items);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }
} 