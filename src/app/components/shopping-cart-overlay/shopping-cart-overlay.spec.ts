import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartOverlay } from './shopping-cart-overlay';

describe('ShoppingCartOverlay', () => {
  let component: ShoppingCartOverlay;
  let fixture: ComponentFixture<ShoppingCartOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
