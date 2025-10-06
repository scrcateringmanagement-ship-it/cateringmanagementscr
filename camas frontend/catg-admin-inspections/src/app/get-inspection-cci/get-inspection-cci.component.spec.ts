import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInspectionCciComponent } from './get-inspection-cci.component';

describe('GetInspectionCciComponent', () => {
  let component: GetInspectionCciComponent;
  let fixture: ComponentFixture<GetInspectionCciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetInspectionCciComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetInspectionCciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
