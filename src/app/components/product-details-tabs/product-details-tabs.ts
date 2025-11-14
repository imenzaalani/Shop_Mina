import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details-tabs.html',
  styleUrl: './product-details-tabs.css',
})
export class ProductDetailsTabs {
  @Input() product: any; // Input property for product data
}
