import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService, Order } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all orders', () => {
    const dummyOrders: Order[] = [
      { items: [], status: 'pending', statusHistory: [], total: 0, createdAt: new Date() },
      { items: [], status: 'paid', statusHistory: [], total: 100, createdAt: new Date() }
    ];
    service.getOrders().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(dummyOrders);
    });
    const req = httpMock.expectOne('http://localhost:3000/api/orders');
    expect(req.request.method).toBe('GET');
    req.flush(dummyOrders);
  });

  it('should create an order', () => {
    const newOrder: Order = { items: [], status: 'pending', statusHistory: [], total: 50, createdAt: new Date() };
    service.createOrder(newOrder).subscribe(order => {
      expect(order).toEqual(newOrder);
    });
    const req = httpMock.expectOne('http://localhost:3000/api/orders');
    expect(req.request.method).toBe('POST');
    req.flush(newOrder);
  });

  it('should update order status', () => {
    const updatedOrder: Order = { items: [], status: 'shipped', statusHistory: [], total: 50, createdAt: new Date() };
    service.updateOrderStatus('1', 'shipped').subscribe(order => {
      expect(order).toEqual(updatedOrder);
    });
    const req = httpMock.expectOne('http://localhost:3000/api/orders/1/status');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedOrder);
  });

  it('should delete an order', () => {
    service.deleteOrder('1').subscribe(res => {
      expect(res).toEqual({ message: 'Order deleted' });
    });
    const req = httpMock.expectOne('http://localhost:3000/api/orders/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Order deleted' });
  });
}); 