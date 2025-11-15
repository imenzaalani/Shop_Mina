import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product/product.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Add this import
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-get-all-products',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './get-all-products.html',
  styleUrl: './get-all-products.css',
})
export class GetAllProducts implements OnInit {
  products: Product[] = [];
  selectedImages: string[] = [];
  showModal = false;
  expandedNames: { [key: string]: boolean } = {};
  showVariantsModal = false;
  selectedProduct: Product | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Sorting
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filtering state
  filterText = '';
  selectedCategory = '';
  selectedStatusBar = '';
  selectedStatusDropdown = '';
  selectedGender = '';
  selectedStockStatus = '';
  selectedType = '';
  filteredProducts: Product[] = [];

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  get paginatedProducts(): Product[] {
    let sorted = [...this.filteredProducts];
    if (this.sortField !== null) {
      sorted.sort((a: any, b: any) => {
        let aValue = a[this.sortField as string];
        let bValue = b[this.sortField as string];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilter();
      },
      error: (err) => console.error('Failed to fetch products', err)
    });
  }

  setStatusBar(status: string) {
    this.selectedStatusBar = status;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchesText = this.filterText ? p.name.toLowerCase().includes(this.filterText.toLowerCase()) : true;
      const matchesCategory = this.selectedCategory ? p.category === this.selectedCategory : true;
      // Special case for "on discount"
      if (this.selectedStatusBar === 'onDiscount') {
        return matchesText && matchesCategory && p.salePrice != null && p.salePrice < p.regularPrice;
      }
      // Use status bar if set, otherwise dropdown
      const statusToFilter = this.selectedStatusBar || this.selectedStatusDropdown;
      const matchesStatus = statusToFilter ? p.status === statusToFilter : true;
      return matchesText && matchesCategory && matchesStatus;
    });
    this.currentPage = 1;
  }

  getImageUrl(img: string): string {
    // If the image is already a full URL, return as is
    if (img.startsWith('/uploads/')) {
      return `${environment.apiUrl}${img}`;
    }
    if (img.startsWith('http')) return img;
    return `${environment.apiUrl}/uploads/${img}`;
  }

  openImageModal(images: string[]): void {
    this.selectedImages = images;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedImages = [];
  }

  toggleNameExpansion(productId: string): void {
    this.expandedNames[productId] = !this.expandedNames[productId];
  }

  openVariantsModal(product: Product): void {
    this.selectedProduct = product;
    this.showVariantsModal = true;
  }

  closeVariantsModal(): void {
    this.showVariantsModal = false;
    this.selectedProduct = null;
  }

  getTotalStock(product: any): number {
    return product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
  }

  // Edit product (placeholder for navigation or modal)
  edit(product: Product): void {
    // TODO: Implement navigation to edit page or open edit modal
    alert('Edit product: ' + product.name);
  }

  // Delete product
  delete(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      if (product._id) {
        this.productService.deleteProduct(product._id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p._id !== product._id);
          },
          error: (err) => alert('Failed to delete product: ' + err.message)
        });
      }
    }
  }

  // Preview product (placeholder)
  preview(product: Product): void {
    // TODO: Implement preview logic (e.g., open modal or navigate)
    alert('Preview product: ' + product.name);
  }

  // Publish product
  publish(product: Product): void {
    if (product._id) {
      const updated: Product = { ...product, status: 'published' as 'published' };
      this.productService.updateProduct(product._id, updated).subscribe({
        next: (updatedProduct) => {
          this.products = this.products.map(p => p._id === product._id ? updatedProduct : p);
        },
        error: (err) => alert('Failed to publish product: ' + err.message)
      });
    }
  }

  // Archive product
  archive(product: Product): void {
    if (product._id) {
      const updated: Product = { ...product, status: 'archived' as 'archived' };
      this.productService.updateProduct(product._id, updated).subscribe({
        next: (updatedProduct) => {
          this.products = this.products.map(p => p._id === product._id ? updatedProduct : p);
        },
        error: (err) => alert('Failed to archive product: ' + err.message)
      });
    }
  }

  get statusCounts() {
    return {
      all: this.products.length,
      published: this.products.filter(p => p.status === 'published').length,
      draft: this.products.filter(p => p.status === 'draft').length,
      archived: this.products.filter(p => p.status === 'archived').length,
      scheduled: this.products.filter(p => p.status === 'scheduled').length,
      onDiscount: this.products.filter(p => p.salePrice != null && p.salePrice < p.regularPrice).length
    };
  }

  get uniqueCategories(): string[] {
    return Array.from(new Set(this.products.map(p => p.category).filter((c): c is string => !!c)));
  }
}
