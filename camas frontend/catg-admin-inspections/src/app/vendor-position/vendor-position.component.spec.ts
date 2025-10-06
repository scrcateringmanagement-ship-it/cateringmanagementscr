import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPositionComponent } from './vendor-position.component';

describe('VendorPositionComponent', () => {
  let component: VendorPositionComponent;
  let fixture: ComponentFixture<VendorPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
