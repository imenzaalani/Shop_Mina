import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  imageUrl: string;
  name: string;
  currentPrice: number;
  description: string;
  collections: string[];
  availability: string;
  images: string[];
  colors: string[];
  sizes: string[];
  type: string;
}

@Component({
  selector: 'app-product-details-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details-tabs.html',
  styleUrl: './product-details-tabs.css',
})
export class ProductDetailsTabs {
  @Input() product!: Product;
}
