import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Coupon, CouponService } from '../../services/coupon/coupon.service';

@Component({
  selector: 'app-coupon-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coupon-management.html',
  styleUrls: ['./coupon-management.css']
})
export class CouponManagement implements OnInit {
  coupons: Coupon[] = [];
  couponForm: FormGroup;
  editingCoupon: Coupon | null = null;
  errorMsg: string = '';
  successMsg: string = '';
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(private couponService:CouponService , private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
      type: ['percentage', Validators.required],
      value: [0, [Validators.required, Validators.min(1)]],
      minOrderAmount: [null],
      maxUses: [null],
      validFrom: [null],
      validTo: [null, Validators.required],
      active: [true],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons() {
    this.couponService.getAllCoupons().subscribe((coupons: Coupon[]) => this.coupons = coupons);
  }

  submitCoupon() {
    if (this.couponForm.invalid) return;
    const coupon: Coupon = this.couponForm.value;
    if (this.editingCoupon) {
      this.couponService.updateCoupon(this.editingCoupon._id!, coupon).subscribe({
        next: () => {
          this.showSuccessPopup('Coupon updated successfully!');
          this.loadCoupons();
          this.cancelEdit();
        },
        error: (err: any) => this.errorMsg = err.error?.error || 'Update failed.'
      });
    } else {
      this.couponService.createCoupon(coupon).subscribe({
        next: () => {
          this.showSuccessPopup('Coupon created successfully!');
          this.loadCoupons();
          this.couponForm.reset({ type: 'percentage', active: true });
        },
        error: (err: any) => this.errorMsg = err.error?.error || 'Create failed.'
      });
    }
  }

  editCoupon(coupon: Coupon) {
    this.editingCoupon = coupon;
    this.couponForm.patchValue(coupon);
  }

  cancelEdit() {
    this.editingCoupon = null;
    this.couponForm.reset({ type: 'percentage', active: true });
    this.errorMsg = '';
    this.successMsg = '';
  }

  deleteCoupon(coupon: Coupon) {
    if (!confirm('Delete this coupon?')) return;
    this.couponService.deleteCoupon(coupon._id!).subscribe({
      next: () => {
        this.showSuccessPopup('Coupon deleted successfully!');
        this.loadCoupons();
      },
      error: (err: any) => this.errorMsg = err.error?.error || 'Delete failed.'
    });
  }

  showSuccessPopup(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 3000); // Hide after 3 seconds
  }
} 