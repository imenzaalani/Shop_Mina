import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define a Product interface (adjust fields as needed)
export interface Product {
  _id?: string;
  name: string;
  description?: string;
  regularPrice: number;
  salePrice?: number;
  images?: string[];
  imageUrl?: string;
  category?: string;
  type?: string;
  gender?: string;
  stockStatus?: string;
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    stock: number; // Only stock for inventory management
    image?: string;
  }>;
  dateOption?: string;
  date?: string;
  schedule?: string;
  status?: 'draft' | 'published' | 'archived' | 'scheduled';
  createdAt?: string;
}

// Add interfaces for stock management
export interface StockCheckRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface StockUpdateRequest {
  productId: string;
  variantId: string;
  quantity: number;
  operation: 'decrease' | 'increase';
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // Your backend API endpoint

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Get products by status
  getProductsByStatus(status: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get product by id
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Create a new product
  createProduct(product: any): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.name);
    if (product.description) formData.append('description', product.description);
    if (product.regularPrice !== undefined && product.regularPrice !== null) formData.append('regularPrice', product.regularPrice.toString());
    if (product.salePrice !== undefined && product.salePrice !== null) formData.append('salePrice', product.salePrice.toString());
    if (product.category) formData.append('category', product.category);
    if (product.type) formData.append('type', product.type);
    if (product.gender) formData.append('gender', product.gender);
    if (product.stockStatus) formData.append('stockStatus', product.stockStatus);
    if (product.dateOption) formData.append('dateOption', product.dateOption);
    if (product.date) formData.append('date', product.date);
    if (product.schedule) formData.append('schedule', product.schedule);
    if (product.imageUrl) formData.append('imageUrl', product.imageUrl);
    if (product.status) formData.append('status', product.status);

    // Handle variants
    if (product.variants && product.variants.length > 0) {
      formData.append('variants', JSON.stringify(product.variants));
      product.variants.forEach((variant: any) => {
        if (variant.imageFile) {
          formData.append(`variantImage_${variant.id}`, variant.imageFile);
        }
      });
    }

    // Handle multiple images (assuming product.images is File[])
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any, idx: number) => {
        formData.append('images', img); // backend should expect 'images' as array
      });
    }

    return this.http.post<Product>(this.apiUrl, formData);
  }

  // Update existing product
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Delete product
  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Stock management methods
  checkStockAvailability(request: StockCheckRequest): Observable<{ available: boolean; currentStock: number }> {
    return this.http.post<{ available: boolean; currentStock: number }>(`${this.apiUrl}/check-stock`, request);
  }

  updateStock(request: StockUpdateRequest): Observable<{ success: boolean; newStock: number }> {
    return this.http.put<{ success: boolean; newStock: number }>(`${this.apiUrl}/update-stock`, request);
  }

  // Get product with real-time stock information
  getProductWithStock(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}/stock`);
  }

  // Get available colors for filters
  getAvailableColors(): Observable<{ color: string, count: number }[]> {
    return this.http.get<{ color: string, count: number }[]>(`${this.apiUrl}/colors`);
  }

  // Get new arrivals
  getNewArrivals(days = 14): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/new-arrivals?days=${days}`);
  }

  // Get best sellers
  getBestSellers(limit = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/best-sellers?limit=${limit}`);
  }
}
