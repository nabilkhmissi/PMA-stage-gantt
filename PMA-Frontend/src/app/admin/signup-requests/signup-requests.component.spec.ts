import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupRequestsComponent } from './signup-requests.component';

describe('SignupRequestsComponent', () => {
  let component: SignupRequestsComponent;
  let fixture: ComponentFixture<SignupRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
