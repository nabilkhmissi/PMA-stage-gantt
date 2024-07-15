import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMyComponent } from './delete-my.component';

describe('DeleteMyComponent', () => {
  let component: DeleteMyComponent;
  let fixture: ComponentFixture<DeleteMyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
