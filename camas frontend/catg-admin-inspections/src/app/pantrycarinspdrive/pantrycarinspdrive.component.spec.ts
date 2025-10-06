import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantrycarinspdriveComponent } from './pantrycarinspdrive.component';

describe('PantrycarinspdriveComponent', () => {
  let component: PantrycarinspdriveComponent;
  let fixture: ComponentFixture<PantrycarinspdriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantrycarinspdriveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantrycarinspdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
