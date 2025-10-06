import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedcardsComponent } from './approvedcards.component';

describe('ApprovedcardsComponent', () => {
  let component: ApprovedcardsComponent;
  let fixture: ComponentFixture<ApprovedcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
