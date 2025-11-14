import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { RecommendationService, Product } from '../../services/recommandarion/recommandation.service';
import { ProductCard } from '../product-card/product-card';

interface ProductCollection {
  _id: string;
  imageUrl: string;
  name: string;
  currentPrice: number;
  discount?: number;
  oldPrice?: number;
  images?: string[];
}

@Component({
  selector: 'app-recently-viewed-products',
  imports: [ProductCard],
  templateUrl: './recently-viewed-products.html',
  styleUrl: './recently-viewed-products.css',
})

export class RecentlyViewedProducts implements OnInit {
  @Input() title: string = 'Recommended For You';
  @Input() type: 'trending' | 'user' | 'product' = 'trending';
  @Input() productId?: string;
  @Input() limit: number = 4;
  
  products: Product[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private recommendationService: RecommendationService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    // Reset scroll position on route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  ngOnInit() {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.isLoading = true;
    this.error = null;

    const loadObservable = this.type === 'trending' ?
      this.recommendationService.getTrendingProducts(this.limit) :
      this.type === 'user' ?
        this.recommendationService.getUserRecommendations(this.limit) :
        this.recommendationService.getProductRecommendations(this.productId || '', this.limit);

    loadObservable.subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recommendations:', err);
        this.error = 'Failed to load recommendations. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private readonly BACKEND_URL = 'http://localhost:3000';

  // Helper method to ensure image URLs are complete
  private getImageUrl(url: string | undefined): string {
    if (!url) return '';
    // If URL is already absolute, return as is
    if (url.startsWith('http')) return url;
    // If URL starts with /, remove the leading slash to prevent double slashes
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    // Combine with backend URL
    return `${this.BACKEND_URL}/${cleanUrl}`;
  }

  // Map Product to ProductCollection for the product card
  mapToCollection(product: Product): ProductCollection {
    // Process images to ensure they have full URLs
    const images = (product.images || []).map(img => this.getImageUrl(img));
    const imageUrl = this.getImageUrl(images[0] || product.imageUrl);

    return {
      _id: product._id,
      name: product.name,
      currentPrice: product.salePrice || product.regularPrice,
      oldPrice: product.salePrice ? product.regularPrice : undefined,
      discount: product.salePrice ? 
        Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100) : 
        undefined,
      imageUrl: imageUrl,
      images: images
    };
  }

  // Handle product card click with smooth scrolling
  onProductClick(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Track the view
    this.recommendationService.trackProductView(product._id).subscribe();
    
    // Store scroll position before navigation
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // Navigate to product details
    this.router.navigate(['/product-details', product.name]).then(() => {
      // Force scroll to top after navigation
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    });
  }
}

