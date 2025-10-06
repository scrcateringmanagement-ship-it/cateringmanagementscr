import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VandeBharatRegComponent } from './vande-bharat-reg.component';

describe('VandeBharatRegComponent', () => {
  let component: VandeBharatRegComponent;
  let fixture: ComponentFixture<VandeBharatRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VandeBharatRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VandeBharatRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
