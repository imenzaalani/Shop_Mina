import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllOrders } from './get-all-orders';

describe('GetAllOrders', () => {
  let component: GetAllOrders;
  let fixture: ComponentFixture<GetAllOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
