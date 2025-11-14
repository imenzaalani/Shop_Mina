import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  getWishlist() {
    return this.wishlistSubject.value;
  }

  addToWishlist(product: any) {
    const current = this.getWishlist();
    if (!current.find(p => p._id === product._id)) {
      this.wishlistSubject.next([...current, product]);
    }
  }

  removeFromWishlist(product: any) {
    const current = this.getWishlist();
    this.wishlistSubject.next(current.filter(p => p._id !== product._id));
  }

  isWishlisted(product: any): boolean {
    return !!this.getWishlist().find(p => p._id === product._id);
  }
}
