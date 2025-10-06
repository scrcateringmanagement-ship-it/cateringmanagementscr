import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeofpaymentComponent } from './modeofpayment.component';

describe('ModeofpaymentComponent', () => {
  let component: ModeofpaymentComponent;
  let fixture: ComponentFixture<ModeofpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeofpaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeofpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
