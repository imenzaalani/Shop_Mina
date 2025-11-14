import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollingText } from './scrolling-text';

describe('ScrollingText', () => {
  let component: ScrollingText;
  let fixture: ComponentFixture<ScrollingText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollingText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollingText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
