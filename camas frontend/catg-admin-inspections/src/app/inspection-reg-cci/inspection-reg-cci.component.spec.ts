import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionRegCciComponent } from './inspection-reg-cci.component';

describe('InspectionRegCciComponent', () => {
  let component: InspectionRegCciComponent;
  let fixture: ComponentFixture<InspectionRegCciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionRegCciComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionRegCciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
