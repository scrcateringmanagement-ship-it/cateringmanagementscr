import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionRegOfficeuserComponent } from './inspection-reg-officeuser.component';

describe('InspectionRegOfficeuserComponent', () => {
  let component: InspectionRegOfficeuserComponent;
  let fixture: ComponentFixture<InspectionRegOfficeuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionRegOfficeuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionRegOfficeuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
