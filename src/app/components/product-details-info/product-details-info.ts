import { Component, OnInit, Input } from '@angular/core';
import { ProductService, Product } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { ShoppingCartOverlay } from '../shopping-cart-overlay/shopping-cart-overlay';

interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number; // Only stock for inventory
  image?: string;
}

@Component({
  selector: 'app-product-details-info',
  standalone: true,
  imports: [CommonModule,ShoppingCartOverlay],
  templateUrl: './product-details-info.html',
  styleUrl: './product-details-info.css',
})

export class ProductDetailsInfo implements OnInit {
  @Input() product!: Product;
  @Input() category?: string;

  selectedColor: string = '';
  selectedSize: string = '';
  quantity: number = 1;
  currentImageIndex: number = 0;
  showCartOverlay = false;
  
  // Stock management properties
  stockInfo: { [key: string]: { available: boolean; stock: number } } = {};
  selectedVariantId: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadStockInformation();
    // Set initial color and size from variants if available
    if (this.product.variants && this.product.variants.length > 0) {
      this.selectedColor = this.product.variants[0].color;
      this.selectedSize = this.product.variants[0].size;
      this.selectedVariantId = this.product.variants[0].id;
    }
  }

  loadStockInformation() {
    if (this.product.variants) {
      this.product.variants.forEach(variant => {
        this.stockInfo[variant.id] = {
          available: variant.stock > 0,
          stock: variant.stock
        };
      });
    }
  }

  isVariantInStock(variantId: string): boolean {
    return this.stockInfo[variantId]?.available || false;
  }

  getVariantStock(variantId: string): number {
    return this.stockInfo[variantId]?.stock || 0;
  }

  isCurrentSelectionInStock(): boolean {
    if (!this.selectedVariantId) return false;
    return this.isVariantInStock(this.selectedVariantId);
  }

  getCurrentStock(): number {
    if (!this.selectedVariantId) return 0;
    return this.getVariantStock(this.selectedVariantId);
  }

  get availableSizes(): string[] {
    if (!this.product.variants || !this.selectedColor) return [];
    return this.product.variants
      .filter(v => v.color === this.selectedColor)
      .map(v => v.size)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  get availableColors(): string[] {
    if (!this.product.variants) return [];
    return this.product.variants
      .map(v => v.color)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  getVariantId(color: string, size: string): string {
    const variant = this.product.variants?.find(v => v.color === color && v.size === size);
    return variant?.id || '';
  }

  getAvailabilityStatus(): string {
    if (!this.product.variants) return 'Unknown';
    const totalStock = this.product.variants.reduce((sum, variant) => sum + variant.stock, 0);
    return totalStock > 0 ? 'In Stock' : 'Out of Stock';
  }

  get mainImageUrl(): string {
    return this.product.images?.[0] || '';
  }

  selectColor(color: string) {
    this.selectedColor = color;
    // Optionally reset size if not available for this color
    const sizes = this.availableSizes;
    if (!sizes.includes(this.selectedSize)) {
      this.selectedSize = sizes[0];
    }
    this.currentImageIndex = 0;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  getColorClass(color: string): string {
    return color.replace(/\s+/g, '-').toLowerCase();
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityInput(event: any) {
    const value = parseInt(event.target.value, 10);
    this.quantity = isNaN(value) || value < 1 ? 1 : value;
  }

  nextImage() {
    if (this.allGalleryImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.allGalleryImages.length;
    }
  }

  prevImage() {
    if (this.allGalleryImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.allGalleryImages.length) % this.allGalleryImages.length;
    }
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }

  addToCart() {
    this.cartService.addToCart({
      product: this.product,
      selectedColor: this.selectedColor,
      selectedSize: this.selectedSize,
      quantity: this.quantity
    });
    this.showCartOverlay = !this.showCartOverlay;
  }

  formatDisplayText(text: string): string {
    return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get allGalleryImages(): string[] {
    // Get main product images, filter out undefined
    const mainImages = (this.product.images || []).filter((img): img is string => !!img);
    // Get all unique variant images (filter out empty/undefined)
    const variantImages = (this.product.variants || [])
      .map(v => v.image)
      .filter((img): img is string => !!img && !mainImages.includes(img));
    // Combine: main images first, then variant images
    return [...mainImages, ...variantImages];
  }
}
