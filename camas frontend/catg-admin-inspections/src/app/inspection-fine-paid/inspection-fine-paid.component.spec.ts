import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionFinePaidComponent } from './inspection-fine-paid.component';

describe('InspectionFinePaidComponent', () => {
  let component: InspectionFinePaidComponent;
  let fixture: ComponentFixture<InspectionFinePaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionFinePaidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionFinePaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
