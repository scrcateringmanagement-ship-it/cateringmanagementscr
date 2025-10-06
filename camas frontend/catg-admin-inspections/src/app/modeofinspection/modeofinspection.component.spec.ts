import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeofinspectionComponent } from './modeofinspection.component';

describe('ModeofinspectionComponent', () => {
  let component: ModeofinspectionComponent;
  let fixture: ComponentFixture<ModeofinspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeofinspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeofinspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
