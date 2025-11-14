import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkouts } from './checkouts';

describe('Checkouts', () => {
  let component: Checkouts;
  let fixture: ComponentFixture<Checkouts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkouts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkouts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
