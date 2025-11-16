import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService, CartItem } from '../../services/cart/cart.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { UserService } from '../../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { CouponService } from '../../services/coupon/coupon.service';
import { environment } from '../../../environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-checkouts',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DecimalPipe, FormsModule, RouterModule],
  templateUrl: './checkouts.html',
  styleUrls: ['./checkouts.css']
})
export class Checkouts implements OnInit, AfterViewInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  itemCount: number = 0;
  shipping: number = 0;
  shippingMethod: string = 'Local Delivery';
  checkoutForm!: FormGroup;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  cardMounted = false;
  cardError: string | null = null;
  isPaying = false;
  discountInput: string = ''
  appliedDiscountCode?: string;
  discountValue?: number;
  isFirstOrder?: boolean;
  discountApiError: string = '';
  appliedDiscount?: { _id: string, code: string, amount: number };
  successMessage = '';

  constructor(
    private cartService: CartService, 
    private fb: FormBuilder, 
    public userService: UserService, 
    private http: HttpClient,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateSummary();
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newsletter: [true],
      country: ['Tunisia', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: [''],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      paymentMethod: ['credit-card'],
      cardName: ['']
    });
    
    // Auto-fill form if user is logged in
    this.autoFillUserData();
    this.initStripe();
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      const cardNameControl = this.checkoutForm.get('cardName');
      if (method === 'credit-card') {
        cardNameControl?.setValidators([Validators.required]);
      } else {
        cardNameControl?.clearValidators();
      }
      cardNameControl?.updateValueAndValidity();
      if (method === 'credit-card') {
        setTimeout(() => {
          this.mountCardElement();
        }, 0);
      } else if (method === 'paypal') {
        setTimeout(() => {
          this.renderPayPalButton();
        }, 0);
      }
    });
    const initialMethod = this.checkoutForm.get('paymentMethod')?.value;
    if (initialMethod === 'credit-card') {
      this.checkoutForm.get('cardName')?.setValidators([Validators.required]);
    } else {
      this.checkoutForm.get('cardName')?.clearValidators();
    }
    this.checkoutForm.get('cardName')?.updateValueAndValidity();
    this.checkoutForm.get('country')?.valueChanges.subscribe((country) => {
      this.updateShipping(country);
    });
    this.updateShipping(this.checkoutForm.get('country')?.value);
  }

  ngAfterViewInit() {
    if (this.checkoutForm.get('paymentMethod')?.value === 'paypal') {
      this.renderPayPalButton();
    }
  }

  async initStripe() {
    this.stripe = await loadStripe('pk_test_51ReGlj2e2iSab2cqTSPo7NCOzX8c5cxmDOuRwB5ZvZPVjV6aikmFO0zaj2PVhzQ7aIhSaOeXfQgPLhnIJn5KAPHA00shPsE3O6');
    if (this.stripe) {
      this.elements = this.stripe.elements();
      if (this.checkoutForm.get('paymentMethod')?.value === 'credit-card') {
        this.mountCardElement();
      }
    }
  }

  calculateSummary() {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.regularPrice || item.product.currentPrice;
      return sum + price * item.quantity;
    }, 0);
    this.itemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.shipping = this.subtotal >= 100 ? 0 : 9.99;
  }

  getTotal(): number {
    return Math.max(0, this.subtotal + this.shipping - (this.discountValue || 0));
  }

  async onSubmit() {
    if (this.checkoutForm.valid) {
      this.isPaying = true;
      const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;
      const orderItems = this.cartItems.map(item => ({
        productId: item.product._id,
        selectedColor: item.selectedColor || item.product.selectedColor,
        selectedSize: item.selectedSize || item.product.selectedSize,
        quantity: item.quantity
      }));
      const shipping = {
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        postalCode: this.checkoutForm.value.postalCode,
        country: this.checkoutForm.value.country
      };
      let orderBase: any = {
        items: orderItems,
        status: 'pending',
        statusHistory: [{ status: 'pending', date: new Date() }],
        shipping,
        fulfillmentStatus: 'not-shipped',
        isFirstOrder: this.isFirstOrder,
        total: this.getTotal(),
        currency: 'TND',
        discount: this.appliedDiscount ? { _id: this.appliedDiscount._id, code: this.appliedDiscount.code, amount: this.appliedDiscount.amount } : undefined
      };
      // User/Guest logic
      if (this.userService.isLoggedIn()) {
        const currentUser = this.userService.getCurrentUser();
        orderBase.userId = currentUser?._id;
        orderBase.isGuestOrder = false;
      } else {
        orderBase.isGuestOrder = true;
        orderBase.guest = {
          email: this.checkoutForm.value.email,
          firstName: this.checkoutForm.value.firstName,
          lastName: this.checkoutForm.value.lastName,
          phone: this.checkoutForm.value.phone
        };
      }
      if (paymentMethod === 'credit-card') {
        const clientSecret = await this.createPaymentIntent(this.getTotal());
        if (this.stripe && this.card) {
          const { paymentIntent, error } = await this.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.card,
              billing_details: {
                name: this.checkoutForm.get('cardName')?.value,
                email: this.checkoutForm.get('email')?.value,
              },
            },
          });
          if (error) {
            this.cardError = error.message || 'Payment failed. Please check your card details.';
          } else if (paymentIntent) {
            this.cardError = null;
            const order = {
              ...orderBase,
              payment: {
                method: 'credit-card',
                status: paymentIntent.status === 'succeeded' ? 'paid' : 'failed',
                transactionId: paymentIntent.id,
                currency: 'TND'
              }
            };
            await this.saveOrder(order);
            this.showSuccess('Payment successful!');
          }
        }
      } else if (paymentMethod === 'cash-on-delivery') {
        const order = {
          ...orderBase,
          payment: {
            method: 'cash-on-delivery',
            status: 'pending',
            currency: 'TND'
          }
        };
        await this.saveOrder(order);
        this.showSuccess('Order placed! You will pay upon delivery.');
      }
      this.isPaying = false;
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  mountCardElement() {
    if (this.elements) {
      // Unmount and destroy previous card element if it exists
      if (this.card) {
        this.card.unmount();
        if (typeof this.card.destroy === 'function') {
          this.card.destroy();
        }
        this.card = null;
        this.cardMounted = false;
      }
      // Only mount if the element exists in the DOM
      const cardElementDiv = document.getElementById('card-element');
      if (cardElementDiv) {
        this.card = this.elements.create('card');
        this.card.mount('#card-element');
        this.cardMounted = true;
      }
    }
  }

  async createPaymentIntent(amount: number): Promise<string> {
    // Replace with your backend API call
    const response = await fetch(`${environment.apiUrl}/api/payments/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    return data.clientSecret;
  }

  renderPayPalButton() {
    const container = document.getElementById('paypal-button-container');
    if (container && typeof paypal !== 'undefined') {
      container.innerHTML = '';
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.getTotal().toFixed(2)
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture();
          // Build your order object here
          const order = {
            items: this.cartItems,
            user: this.checkoutForm.value,
            payment: { method: 'paypal', paypalId: details.id, currency: 'TND' },
            total: this.getTotal()
          };
          await this.saveOrder(order);
          this.showSuccess('Transaction completed by ' + details.payer.name.given_name);
        },
        onClick: (data: any, actions: any) => {
          this.checkoutForm.updateValueAndValidity();
          if (!this.checkoutForm.valid) {
            this.checkoutForm.markAllAsTouched();
            return actions.reject();
          }
          return actions.resolve();
        }
      }).render('#paypal-button-container');
    }
  }

  async saveOrder(order: any) {
    const response = await fetch(`${environment.apiUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return response.json();
  }

  updateShipping(country: string) {
    if (country === 'Tunisia') {
      this.shippingMethod = 'Local Delivery';
      this.shipping = 0;
    } else {
      this.shippingMethod = 'International Shipping';
      this.shipping = 19.99;
    }
  }

  autoFillUserData() {

    if (this.userService.isLoggedIn()) {
      const currentUser = this.userService.getCurrentUser();
      
      if (currentUser) {
        const formData = {
          email: currentUser.email || '',
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          address: currentUser.address || '',
          city: currentUser.city || '',
          postalCode: currentUser.postalCode || '',
          phone: currentUser.phone || ''
        };
        
        this.checkoutForm.patchValue(formData);
      }
    }
  }

  applyDiscount(code: string) {
    this.discountApiError = '';
    this.couponService.applyCoupon(code, this.subtotal + this.shipping).subscribe({
      next: (res) => {
        this.appliedDiscount = {
          _id: res.coupon._id,
          code: res.coupon.code,
          amount: res.coupon.amount
        };
        this.appliedDiscountCode = res.coupon.code;
        this.discountValue = res.coupon.amount;
        // Optionally update UI with res.finalTotal
      },
      error: (err) => {
        this.appliedDiscount = undefined;
        this.appliedDiscountCode = undefined;
        this.discountValue = undefined;
        this.discountApiError = err.error?.error || 'Invalid or expired coupon.';
      }
    });
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
