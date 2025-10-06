import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VandeBharatInspComponent } from './vande-bharat-insp.component';

describe('VandeBharatInspComponent', () => {
  let component: VandeBharatInspComponent;
  let fixture: ComponentFixture<VandeBharatInspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VandeBharatInspComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VandeBharatInspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
