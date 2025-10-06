import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsdetailsComponent } from './contractsdetails.component';

describe('ContractsdetailsComponent', () => {
  let component: ContractsdetailsComponent;
  let fixture: ComponentFixture<ContractsdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
