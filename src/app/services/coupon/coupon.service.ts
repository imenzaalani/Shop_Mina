import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


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
  private apiUrl = `${environment.apiUrl}/api/coupons`;

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
    return this.http.post<any>(`${this.apiUrl}/api/apply-coupon`, { code, total });
  }
} 