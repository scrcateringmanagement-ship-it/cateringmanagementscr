import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CciRoleGetIdcardsComponent } from './cci-role-get-idcards.component';

describe('CciRoleGetIdcardsComponent', () => {
  let component: CciRoleGetIdcardsComponent;
  let fixture: ComponentFixture<CciRoleGetIdcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CciRoleGetIdcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CciRoleGetIdcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
