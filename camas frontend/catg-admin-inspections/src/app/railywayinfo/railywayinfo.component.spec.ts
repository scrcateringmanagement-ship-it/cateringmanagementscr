import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailywayinfoComponent } from './railywayinfo.component';

describe('RailywayinfoComponent', () => {
  let component: RailywayinfoComponent;
  let fixture: ComponentFixture<RailywayinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RailywayinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RailywayinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
