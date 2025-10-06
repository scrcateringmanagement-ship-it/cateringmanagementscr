import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInspectionOfficeComponent } from './get-inspection-office.component';

describe('GetInspectionOfficeComponent', () => {
  let component: GetInspectionOfficeComponent;
  let fixture: ComponentFixture<GetInspectionOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetInspectionOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetInspectionOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
