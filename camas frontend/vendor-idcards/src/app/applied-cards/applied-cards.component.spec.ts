import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedCardsComponent } from './applied-cards.component';

describe('AppliedCardsComponent', () => {
  let component: AppliedCardsComponent;
  let fixture: ComponentFixture<AppliedCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
