import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  wishlistProducts: any[] = [];
  private wishlistService = inject(WishlistService);

  ngOnInit() {
    this.wishlistProducts = this.wishlistService.getWishlist();
    this.wishlistService.wishlist$.subscribe((list: any[]) => {
      this.wishlistProducts = list;
    });
  }
}
