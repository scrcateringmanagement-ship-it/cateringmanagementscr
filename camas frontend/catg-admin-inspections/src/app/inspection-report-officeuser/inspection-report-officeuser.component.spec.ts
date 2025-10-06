import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionReportOfficeuserComponent } from './inspection-report-officeuser.component';

describe('InspectionReportOfficeuserComponent', () => {
  let component: InspectionReportOfficeuserComponent;
  let fixture: ComponentFixture<InspectionReportOfficeuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionReportOfficeuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionReportOfficeuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
