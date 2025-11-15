import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  regularPrice: number;
  salePrice?: number;
  images: string[];
  imageUrl?: string;
  category: string;
  type: string;
  gender: string;
  tags?: string[];
  variants: ProductVariant[];
  viewCount?: number;
  purchaseCount?: number;
  status?: string;
  dateOption?: string;
  date?: string;
  schedule?: string;
  createdAt?: Date;
  updatedAt?: Date;
  soldCount?: number;
}

@Injectable({
  providedIn: 'root'
})

export class RecommendationService {
  private API_URL = `${environment.apiUrl}/api/recommendations`;

  constructor(private http: HttpClient) {}

  // Track when a product is viewed
  trackProductView(productId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/view`, { productId });
  }

  // Get recommended products based on a product
  getProductRecommendations(productId: string, limit: number = 4): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/product/${productId}`, {
      params: { limit: limit.toString() }
    });
  }

  // Get recommendations for the current user
  getUserRecommendations(limit: number = 4): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/user`, {
      params: { limit: limit.toString() }
    });
  }

  // Get trending products
  getTrendingProducts(limit: number = 4): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/trending`, {
      params: { limit: limit.toString() }
    });
  }
}