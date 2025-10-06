import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionRegApproverComponent } from './inspection-reg-approver.component';

describe('InspectionRegApproverComponent', () => {
  let component: InspectionRegApproverComponent;
  let fixture: ComponentFixture<InspectionRegApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionRegApproverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionRegApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
