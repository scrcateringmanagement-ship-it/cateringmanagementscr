import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeofoperationComponent } from './modeofoperation.component';

describe('ModeofoperationComponent', () => {
  let component: ModeofoperationComponent;
  let fixture: ComponentFixture<ModeofoperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeofoperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeofoperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
