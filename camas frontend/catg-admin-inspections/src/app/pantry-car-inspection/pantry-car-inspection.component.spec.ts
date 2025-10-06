import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryCarInspectionComponent } from './pantry-car-inspection.component';

describe('PantryCarInspectionComponent', () => {
  let component: PantryCarInspectionComponent;
  let fixture: ComponentFixture<PantryCarInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantryCarInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantryCarInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
