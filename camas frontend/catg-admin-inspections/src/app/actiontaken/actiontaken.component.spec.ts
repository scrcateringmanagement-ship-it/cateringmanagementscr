import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiontakenComponent } from './actiontaken.component';

describe('ActiontakenComponent', () => {
  let component: ActiontakenComponent;
  let fixture: ComponentFixture<ActiontakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiontakenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiontakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
