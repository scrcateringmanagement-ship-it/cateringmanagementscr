import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInspectionApproverComponent } from './get-inspection-approver.component';

describe('GetInspectionApproverComponent', () => {
  let component: GetInspectionApproverComponent;
  let fixture: ComponentFixture<GetInspectionApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetInspectionApproverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetInspectionApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
