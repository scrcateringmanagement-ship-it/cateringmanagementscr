import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAssetDetailsComponent } from './contract-asset-details.component';

describe('ContractAssetDetailsComponent', () => {
  let component: ContractAssetDetailsComponent;
  let fixture: ComponentFixture<ContractAssetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractAssetDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
