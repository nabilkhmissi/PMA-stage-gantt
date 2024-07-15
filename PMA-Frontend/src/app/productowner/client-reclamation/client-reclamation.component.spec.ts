import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReclamationComponent } from './client-reclamation.component';

describe('ClientReclamationComponent', () => {
  let component: ClientReclamationComponent;
  let fixture: ComponentFixture<ClientReclamationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientReclamationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
