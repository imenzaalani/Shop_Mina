import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsInfo } from './product-details-info';

describe('ProductDetailsInfo', () => {
  let component: ProductDetailsInfo;
  let fixture: ComponentFixture<ProductDetailsInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
