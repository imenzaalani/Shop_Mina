import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Discount {
  code: string;
  amount: number;
}

export interface Payment {
  method: string;
  status: string;
  transactionId?: string;
  currency?: string;
}

export interface Guest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface StatusHistory {
  status: string;
  date: string;
}

export interface Shipping {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  carrier?: string;
  trackingNumber?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  _id?: string;
  userId?: string | User;
  isGuestOrder?: boolean;
  guest?: Guest;
  items: OrderItem[];
  status: string;
  statusHistory: StatusHistory[];
  shipping?: Shipping;
  payment?: Payment;
  currency?: string;
  discount?: Discount;
  discountCode?: string;
  discountValue?: number;
  fulfillmentStatus?: string;
  isFirstOrder?: boolean;
  total: number;
  createdAt: string | Date;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteOrder(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }
} 