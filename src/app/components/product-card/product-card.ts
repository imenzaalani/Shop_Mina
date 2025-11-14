import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { CommonModule } from '@angular/common';

interface ProductCollection {
  imageUrl: string;
  name: string;
  currentPrice: number;
  discount?: number;
  oldPrice?: number;
  images?: string[];
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})

export class ProductCard{
  @Input() collection!: ProductCollection;
  @Output() cardClick = new EventEmitter<Event>();
  isWishlisted = false;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit() {
    this.isWishlisted = this.wishlistService.isWishlisted(this.collection);
  }

  toggleWishlist(event: MouseEvent) {
    event.stopPropagation();
    this.isWishlisted = !this.isWishlisted;
  }

  addToWishlist(event: Event) {
    event.stopPropagation();
    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.collection);
    } else {
      this.wishlistService.addToWishlist(this.collection);
    }
    this.isWishlisted = !this.isWishlisted;
  }

  openQuickView(event: Event) {
    event.stopPropagation();
    // Add your quick view logic here
  }

  onCardClick(event: Event) {
    event.preventDefault();
    this.cardClick.emit(event);
  }
}
