import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfrimComponent } from './confrim.component';

describe('ConfrimComponent', () => {
  let component: ConfrimComponent;
  let fixture: ComponentFixture<ConfrimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfrimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
