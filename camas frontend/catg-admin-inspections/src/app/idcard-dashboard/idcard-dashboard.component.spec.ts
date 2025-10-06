import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardDashboardComponent } from './idcard-dashboard.component';

describe('IdcardDashboardComponent', () => {
  let component: IdcardDashboardComponent;
  let fixture: ComponentFixture<IdcardDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdcardDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
