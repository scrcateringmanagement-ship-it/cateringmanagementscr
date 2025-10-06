import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedIdcardsComponent } from './completed-idcards.component';

describe('CompletedIdcardsComponent', () => {
  let component: CompletedIdcardsComponent;
  let fixture: ComponentFixture<CompletedIdcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedIdcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedIdcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
