import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { FilterProducts } from '../../components/filter-products/filter-products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCard,
    FilterProducts
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  showFilterOverlay: boolean = false; // Property to control filter overlay visibility
  showSortDropdown: boolean = false; // Controls visibility of the custom sort dropdown
  selectedSortOption: string = 'Alphabetically, A-Z'; // Default selected option
  showInStockOnly: boolean = false; // New property for the toggle

  sortOptions: string[] = [
    'Featured',
    'Best selling',
    'Alphabetically, A-Z',
    'Alphabetically, Z-A',
    'Price, low to high',
    'Price, high to low',
    'Date, old to new',
    'Date, new to old'
  ];

  products: Product[] = [];
  mappedProducts: any[] = [];
  genderFilter: string | null = null;
  typeFilter: string | null = null;
  categoryFilter: string | null = null;

  // Helper to check if a product is in stock
  isProductInStock(product: any): boolean {
    return product.variants && product.variants.some((variant: any) => variant.stock > 0);
  }

  sortMappedProducts() {
    switch (this.selectedSortOption) {
      case 'Alphabetically, A-Z':
        this.mappedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetically, Z-A':
        this.mappedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Price, low to high':
        this.mappedProducts.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'Price, high to low':
        this.mappedProducts.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'Date, old to new':
        // If you have a date field, use it here
        break;
      case 'Date, new to old':
        // If you have a date field, use it here
        break;
      // Add more cases as needed
      default:
        // 'Featured', 'Best selling', etc. can be handled here if you have logic
        break;
    }
  }

  filterAndMapProducts() {
    let filtered = this.products;

    // Only show published products, or scheduled products that are currently active
    const now = new Date();
    filtered = filtered.filter(product => {
      if (typeof product.status !== 'string') return false;
      if (product.status === 'published') {
        return true;
      }
      if (product.status === 'scheduled') {
        if (product.dateOption === 'Single Date') {
          if (product.date) {
            const publishDate = new Date(product.date);
            return publishDate <= now;
          }
          return false;
        } else if (product.dateOption === 'Custom Range') {
          if (!product.schedule) return false;
          const [startStr, endStr] = product.schedule.split('-').map((s: string) => s.trim());
          if (startStr && endStr) {
            const startDate = new Date(startStr);
            const endDate = new Date(endStr);
            return startDate <= now && now <= endDate;
          }
          return false;
        }
        return false;
      }
      return false; // Hide drafts and archived
    });

    if (this.genderFilter) {
      const genderFilterLower = this.genderFilter.toLowerCase();
      filtered = filtered.filter(product => {
        if (!product.gender) return false;
        const productGender = product.gender.toString().toLowerCase();
        // Include if gender matches or product is unisex
        return productGender === genderFilterLower || productGender === 'unisex';
      });
    }
    if (this.categoryFilter) {
      // Map URL parameter to database value if needed
      const categoryMap: {[key: string]: string} = {
        'shoes': 'footwear'
      };
      
      const categoryFilter = categoryMap[this.categoryFilter.toLowerCase()] || this.categoryFilter.toLowerCase();
      
      filtered = filtered.filter(product => {
        if (!product.category) return false;
        const productCategory = product.category.toString().toLowerCase();
        return productCategory === categoryFilter;
      });
    }
    if (this.typeFilter) {
      filtered = filtered.filter(product => 
        product.type && 
        product.type.toString().toLowerCase() === this.typeFilter?.toLowerCase()
      );
    }
    if (this.showInStockOnly) {
      filtered = filtered.filter(product => this.isProductInStock(product));
    }

    this.mappedProducts = filtered.map(product => ({
      name: product.name,
      imageUrl: (product.images && product.images.length > 0) ? ('http://localhost:3000' + product.images[0]) : 'assets/images/placeholder.png',
      images: product.images ? product.images.map(img => 'http://localhost:3000' + img) : [],
      currentPrice: product.salePrice ?? product.regularPrice,
      oldPrice: product.salePrice ? product.regularPrice : undefined,
      discount: (product.salePrice && product.regularPrice) ? +((100 * (product.regularPrice - product.salePrice) / product.regularPrice).toFixed(0)) : undefined
    }));

    this.sortMappedProducts();
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.genderFilter = params.get('gender');
      this.typeFilter = params.get('type');
      this.categoryFilter = params.get('category');
      
      this.productService.getProducts().subscribe({
        next: (data) => {
          this.products = data;
          this.filterAndMapProducts();
        },
        error: (err) => console.error('Failed to fetch products', err)
      });
    });
  }

  toggleFilterOverlay() {
    this.showFilterOverlay = !this.showFilterOverlay;
  }

  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  onSortOptionSelected(option: string): void {
    this.selectedSortOption = option;
    this.showSortDropdown = false;
    this.sortMappedProducts();
  }

  onProductClick(product: any, event: Event): void {
    event.preventDefault();
    // Navigate to product details page with product name
    if (product && product.name) {
      // Convert product name to URL-friendly format
      const productName = product.name.toLowerCase().replace(/\s+/g, '-');
      this.router.navigate(['/product-details', productName]);
    }
  }

  toggleInStockOnly() {
    this.showInStockOnly = !this.showInStockOnly;
    this.filterAndMapProducts();
  }
}

