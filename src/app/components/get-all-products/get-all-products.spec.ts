import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllProducts } from './get-all-products';

describe('GetAllProducts', () => {
  let component: GetAllProducts;
  let fixture: ComponentFixture<GetAllProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
