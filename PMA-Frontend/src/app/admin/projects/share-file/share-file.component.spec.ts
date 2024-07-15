import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareFileComponent } from './share-file.component';

describe('ShareFileComponent', () => {
  let component: ShareFileComponent;
  let fixture: ComponentFixture<ShareFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
