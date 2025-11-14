import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllUsers } from './get-all-users';

describe('GetAllUsers', () => {
  let component: GetAllUsers;
  let fixture: ComponentFixture<GetAllUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
