import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyViewedProducts } from './recently-viewed-products';

describe('RecentlyViewedProducts', () => {
  let component: RecentlyViewedProducts;
  let fixture: ComponentFixture<RecentlyViewedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentlyViewedProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyViewedProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
