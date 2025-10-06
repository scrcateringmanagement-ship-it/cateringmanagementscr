import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverGetcancelledIdcardsComponent } from './approver-getcancelled-idcards.component';

describe('ApproverGetcancelledIdcardsComponent', () => {
  let component: ApproverGetcancelledIdcardsComponent;
  let fixture: ComponentFixture<ApproverGetcancelledIdcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproverGetcancelledIdcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproverGetcancelledIdcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
