import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CciroleapprovedComponent } from './cciroleapproved.component';

describe('CciroleapprovedComponent', () => {
  let component: CciroleapprovedComponent;
  let fixture: ComponentFixture<CciroleapprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CciroleapprovedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CciroleapprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
