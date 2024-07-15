import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ProcesverbalComponent } from "./procesverbal.component";

describe("ProcesverbalComponent", () => {
  let component: ProcesverbalComponent;
  let fixture: ComponentFixture<ProcesverbalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProcesverbalComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesverbalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
