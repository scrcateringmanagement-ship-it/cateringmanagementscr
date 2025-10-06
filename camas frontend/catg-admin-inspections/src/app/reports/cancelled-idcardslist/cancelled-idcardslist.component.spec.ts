import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledIdcardslistComponent } from './cancelled-idcardslist.component';

describe('CancelledIdcardslistComponent', () => {
  let component: CancelledIdcardslistComponent;
  let fixture: ComponentFixture<CancelledIdcardslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelledIdcardslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelledIdcardslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
