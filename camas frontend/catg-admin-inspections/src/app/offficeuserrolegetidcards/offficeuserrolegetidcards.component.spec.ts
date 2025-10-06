import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffficeuserrolegetidcardsComponent } from './offficeuserrolegetidcards.component';

describe('OffficeuserrolegetidcardsComponent', () => {
  let component: OffficeuserrolegetidcardsComponent;
  let fixture: ComponentFixture<OffficeuserrolegetidcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffficeuserrolegetidcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffficeuserrolegetidcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
