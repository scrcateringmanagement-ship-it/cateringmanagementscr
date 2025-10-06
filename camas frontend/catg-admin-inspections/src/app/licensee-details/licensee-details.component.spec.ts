import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseeDetailsComponent } from './licensee-details.component';

describe('LicenseeDetailsComponent', () => {
  let component: LicenseeDetailsComponent;
  let fixture: ComponentFixture<LicenseeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
