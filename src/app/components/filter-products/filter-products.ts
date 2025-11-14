import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Add this import
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-products',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Add FormsModule here
  templateUrl: './filter-products.html',
  styleUrl: './filter-products.css',
})

export class FilterProducts implements OnInit {
  @Output() close = new EventEmitter<void>();
  isVisible = false;
  selectedSort: string = 'news';
  expandedSection: string | null = null;
  withDiscount: boolean = false;

  availableColors: { color: string, count: number }[] = [];
  selectedColor: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    setTimeout(() => this.isVisible = true, 10);
    this.productService.getAvailableColors().subscribe(colors => {
      this.availableColors = colors;
    });
  }

  onClose() {
    this.isVisible = false;
    setTimeout(() => this.close.emit(), 300); // match CSS transition duration
  }

  selectSort(sort: string) {
    this.selectedSort = sort;
  }

  toggleSection(section: string) {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  selectColor(color: string) {
    this.selectedColor = color;
    // Optionally emit or filter products here
  }
}
