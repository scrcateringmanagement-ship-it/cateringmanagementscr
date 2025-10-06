import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffficeuserrolegetrejectedidcardsComponent } from './offficeuserrolegetrejectedidcards.component';

describe('OffficeuserrolegetrejectedidcardsComponent', () => {
  let component: OffficeuserrolegetrejectedidcardsComponent;
  let fixture: ComponentFixture<OffficeuserrolegetrejectedidcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffficeuserrolegetrejectedidcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffficeuserrolegetrejectedidcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
