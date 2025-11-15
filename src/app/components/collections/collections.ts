import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService, Product } from '../../services/product/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCard } from '../product-card/product-card';
import { environment } from '../../../environments/environment';

interface ProductCollection {
  imageUrl: string;
  name: string;
  currentPrice: number;
  discount?: number;
  oldPrice?: number;
  images?: string[];
  salePrice?: number;
  regularPrice?: number;
}

@Component({
  selector: 'app-collections',
  imports: [ProductCard, RouterLink],
  templateUrl: './collections.html',
  styleUrl: './collections.css',
})

export class Collections implements OnInit {
  @ViewChild('collectionsScroll') collectionsScroll!: ElementRef;

  activeTab: string = 'BEST SELLERS';
  products: Product[] = [];
  displayedCollections: ProductCollection[] = [];

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.displayedCollections = this.products.slice(0, 6).map(product => ({
          imageUrl: (product.images && product.images.length > 0)
            ? (`${environment.apiUrl}${product.images[0]}`)
            : 'assets/images/placeholder.png',
          name: product.name,
          currentPrice: product.salePrice || product.regularPrice,
          discount: product.salePrice && product.regularPrice ? Math.round(100 - (product.salePrice / product.regularPrice * 100)) : undefined,
          oldPrice: product.salePrice && product.regularPrice ? product.regularPrice : undefined,
          images: product.images ? product.images.map(img => `${environment.apiUrl}${img}`) : [],
          salePrice: product.salePrice,
          regularPrice: product.regularPrice
        }));
      },
      error: (err) => console.error('Failed to fetch products', err)
    });

    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'new-arrivals') {
        this.onTabClick('NEW PRODUCTS');
        setTimeout(() => {
          const section = document.getElementById('collections-section');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

  }

  scroll(direction: 'left' | 'right'): void {
    const scrollContainer = this.collectionsScroll.nativeElement;
    const scrollAmount = 300;
    if (direction === 'left') {
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  onCardClick(productName: string): void {
    // Handle product card click
  }

  onTabClick(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'NEW PRODUCTS') {
      this.productService.getNewArrivals(14).subscribe({
        next: (data: Product[]) => {
          this.displayedCollections = data.slice(0, 6).map((product: Product) => ({
            imageUrl: (product.images && product.images.length > 0)
              ? (`${environment.apiUrl}${product.images[0]}`)
              : 'assets/images/placeholder.png',
            name: product.name,
            currentPrice: product.salePrice || product.regularPrice,
            discount: product.salePrice && product.regularPrice ? Math.round(100 - (product.salePrice / product.regularPrice * 100)) : undefined,
            oldPrice: product.salePrice && product.regularPrice ? product.regularPrice : undefined,
            images: product.images ? product.images.map((img: string) => `${environment.apiUrl}${img}`) : [],
            salePrice: product.salePrice,
            regularPrice: product.regularPrice
          }));
        },
        error: (err: any) => console.error('Failed to fetch new arrivals', err)
      });
    } else if (tabName === 'BEST SELLERS') {
      this.productService.getBestSellers(6).subscribe({
        next: (data: Product[]) => {
          this.displayedCollections = data.slice(0, 6).map((product: Product) => ({
            imageUrl: (product.images && product.images.length > 0)
              ? (`${environment.apiUrl}${product.images[0]}`)
              : 'assets/images/placeholder.png',
            name: product.name,
            currentPrice: product.salePrice || product.regularPrice,
            discount: product.salePrice && product.regularPrice ? Math.round(100 - (product.salePrice / product.regularPrice * 100)) : undefined,
            oldPrice: product.salePrice && product.regularPrice ? product.regularPrice : undefined,
            images: product.images ? product.images.map((img: string) => `${environment.apiUrl}${img}`) : [],
            salePrice: product.salePrice,
            regularPrice: product.regularPrice
          }));
        },
        error: (err: any) => console.error('Failed to fetch best sellers', err)
      });
    } else {
      // Default: show all products
      this.displayedCollections = this.products.slice(0, 6).map((product: Product) => ({
        imageUrl: (product.images && product.images.length > 0)
          ? (`${environment.apiUrl}${product.images[0]}`)
          : 'assets/images/placeholder.png',
        name: product.name,
        currentPrice: product.salePrice || product.regularPrice,
        discount: product.salePrice && product.regularPrice ? Math.round(100 - (product.salePrice / product.regularPrice * 100)) : undefined,
        oldPrice: product.salePrice && product.regularPrice ? product.regularPrice : undefined,
        images: product.images ? product.images.map((img: string) => `${environment.apiUrl}${img}`) : [],
        salePrice: product.salePrice,
        regularPrice: product.regularPrice
      }));
    }
  }
}
