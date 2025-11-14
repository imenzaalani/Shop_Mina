import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsTabs } from './product-details-tabs';

describe('ProductDetailsTabs', () => {
  let component: ProductDetailsTabs;
  let fixture: ComponentFixture<ProductDetailsTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
