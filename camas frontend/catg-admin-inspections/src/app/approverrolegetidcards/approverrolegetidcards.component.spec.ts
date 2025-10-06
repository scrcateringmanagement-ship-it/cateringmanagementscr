import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverrolegetidcardsComponent } from './approverrolegetidcards.component';

describe('ApproverrolegetidcardsComponent', () => {
  let component: ApproverrolegetidcardsComponent;
  let fixture: ComponentFixture<ApproverrolegetidcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproverrolegetidcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproverrolegetidcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
