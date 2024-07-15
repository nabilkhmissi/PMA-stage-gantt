import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesVerbalComponent } from './proces-verbal.component';

describe('ProcesVerbalComponent', () => {
  let component: ProcesVerbalComponent;
  let fixture: ComponentFixture<ProcesVerbalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesVerbalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesVerbalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
