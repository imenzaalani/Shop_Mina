import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';

const mockProduct = {
  _id: '1',
  name: 'Test Product',
  salePrice: 10,
  regularPrice: 15,
  currentPrice: 15,
  images: ['img1.jpg'],
  imageUrl: 'img1.jpg',
  colors: ['Red'],
  sizes: ['M'],
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an item to the cart', () => {
    const item: CartItem = {
      product: mockProduct,
      selectedColor: 'Red',
      selectedSize: 'M',
      quantity: 1
    };
    service.addToCart(item);
    expect(service.getCartItems().length).toBe(1);
    expect(service.getCartItems()[0]).toEqual(item);
  });

  it('should increment quantity if same product/color/size is added', () => {
    const item: CartItem = {
      product: mockProduct,
      selectedColor: 'Red',
      selectedSize: 'M',
      quantity: 1
    };
    service.addToCart(item);
    service.addToCart(item);
    expect(service.getCartItems().length).toBe(1);
    expect(service.getCartItems()[0].quantity).toBe(2);
  });

  it('should add different items for different color or size', () => {
    const item1: CartItem = {
      product: mockProduct,
      selectedColor: 'Red',
      selectedSize: 'M',
      quantity: 1
    };
    const item2: CartItem = {
      product: mockProduct,
      selectedColor: 'Red',
      selectedSize: 'L',
      quantity: 1
    };
    service.addToCart(item1);
    service.addToCart(item2);
    expect(service.getCartItems().length).toBe(2);
  });

  it('should remove an item by index', () => {
    const item: CartItem = {
      product: mockProduct,
      selectedColor: 'Red',
      selectedSize: 'M',
      quantity: 1
    };
    service.addToCart(item);
    service.removeFromCart(0);
    expect(service.getCartItems().length).toBe(0);
  });

  it('should clear the cart', () => {
    const item: CartItem = {
      product: mockProduct,
      selectedColor: 'Red',
      selectedSize: 'M',
      quantity: 1
    };
    service.addToCart(item);
    service.clearCart();
    expect(service.getCartItems().length).toBe(0);
  });
}); 