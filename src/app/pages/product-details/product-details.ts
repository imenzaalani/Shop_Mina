import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product/product.service';
import { ProductDetailsInfo } from '../../components/product-details-info/product-details-info';
import { ProductDetailsTabs } from '../../components/product-details-tabs/product-details-tabs';
import { RecentlyViewedProducts } from '../../components/recently-viewed-products/recently-viewed-products';

interface Breadcrumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductDetailsInfo,
    ProductDetailsTabs,
    RecentlyViewedProducts
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  productName: string | null = null;
  product: any; // Use 'any' to allow mapping
  breadcrumbs: Breadcrumb[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productName = params.get('productName');
      if (this.productName) {
        // Convert the URL-friendly name back to the original format for comparison
        const originalName = this.productName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        this.productService.getProducts().subscribe(products => {
          // Try to find by URL-friendly name first, then by original name
          const found = products.find(p => 
            p.name.toLowerCase().replace(/\s+/g, '-') === this.productName ||
            p.name === originalName
          );
          
          if (found) {
            this.product = this.mapProduct(found);
            this.breadcrumbs = [
              { label: 'Home', link: '/' },
              { label: 'Products', link: '/products' },
              { label: found.name }
            ];
          } else {
            this.product = undefined;
            console.error('Product not found:', this.productName);
          }
        });
      }
    });
  }

  mapProduct(product: Product): any {
    const backendUrl = 'http://localhost:3000';
    const images = (product.images || []).map(img =>
      img.startsWith('http') ? img : backendUrl + img
    );
    const imageUrl = images.length > 0
      ? images[0]
      : (product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : backendUrl + product.imageUrl) : '');
    const variants = (product.variants || []).map(v => ({
      ...v,
      color: v.color ? v.color.trim().toLowerCase() : v.color,
      size: v.size ? v.size.trim().toUpperCase() : v.size,
      image: v.image ? (v.image.startsWith('http') ? v.image : backendUrl + v.image) : undefined
    }));
    const colors = variants.length > 0
      ? [...new Set(variants.map(v => v.color))]
      : ((product as any).colors || []);
    const sizes = variants.length > 0
      ? [...new Set(variants.map(v => v.size))]
      : ((product as any).sizes || []);
    return {
      ...product,
      images,
      imageUrl,
      variants,
      name: product.name,
      currentPrice: product.salePrice ?? product.regularPrice ?? 0,
      description: product.description || '',
      collections: (product as any).collections || [],
      availability: (product as any).availability || 'In Stock',
      colors,
      sizes,
      type: (product as any).type || ''
    };
  }
}

