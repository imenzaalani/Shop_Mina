import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details-info.html',
  styleUrl: './product-details-info.css',
})
export class ProductDetailsInfo {
  @Input() product: any; // Input property for product data
}
