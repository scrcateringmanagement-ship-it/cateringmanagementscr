import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitwiseidcardsComponent } from './unitwiseidcards.component';

describe('UnitwiseidcardsComponent', () => {
  let component: UnitwiseidcardsComponent;
  let fixture: ComponentFixture<UnitwiseidcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitwiseidcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitwiseidcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
