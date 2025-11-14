import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Coupon {
  _id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount?: number;
  validFrom?: string;
  validTo?: string;
  active: boolean;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class CouponService {
  private apiUrl = 'http://localhost:3000/api/coupons';

  constructor(private http: HttpClient) {}

  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(this.apiUrl, {
      ...coupon,
      code: coupon.code.toUpperCase()
    });
  }

  updateCoupon(id: string, coupon: Partial<Coupon>): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, {
      ...coupon,
      code: coupon.code?.toUpperCase()
    });
  }

  deleteCoupon(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  applyCoupon(code: string, total: number): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/apply-coupon', { code, total });
  }
} 