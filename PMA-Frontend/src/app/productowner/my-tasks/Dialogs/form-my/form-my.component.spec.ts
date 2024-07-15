import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMyComponent } from './form-my.component';

describe('FormMyComponent', () => {
  let component: FormMyComponent;
  let fixture: ComponentFixture<FormMyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
