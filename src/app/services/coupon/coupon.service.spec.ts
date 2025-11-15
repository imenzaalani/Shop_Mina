import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CouponService, Coupon } from './coupon.service';
import { environment } from '../../../environments/environment';

describe('CouponService', () => {
  let service: CouponService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CouponService]
    });
    service = TestBed.inject(CouponService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all coupons', () => {
    const dummyCoupons: Coupon[] = [
      { code: 'TEST', type: 'fixed', value: 5, active: true },
      { code: 'SUMMER', type: 'percentage', value: 10, active: true }
    ];
    service.getAllCoupons().subscribe(coupons => {
      expect(coupons.length).toBe(2);
      expect(coupons).toEqual(dummyCoupons);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/coupons`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCoupons);
  });

  it('should create a coupon', () => {
    const newCoupon: Coupon = { code: 'NEW', type: 'fixed', value: 10, active: true };
    service.createCoupon(newCoupon).subscribe(coupon => {
      expect(coupon).toEqual(newCoupon);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/coupons`);
    expect(req.request.method).toBe('POST');
    req.flush(newCoupon);
  });

  it('should update a coupon', () => {
    const updatedCoupon: Coupon = { _id: '1', code: 'UPD', type: 'fixed', value: 15, active: true };
    service.updateCoupon('1', updatedCoupon).subscribe(coupon => {
      expect(coupon).toEqual(updatedCoupon);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/coupons/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedCoupon);
  });

  it('should delete a coupon', () => {
    service.deleteCoupon('1').subscribe(res => {
      expect(res).toEqual({ message: 'Coupon deleted' });
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/coupons/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Coupon deleted' });
  });
}); 