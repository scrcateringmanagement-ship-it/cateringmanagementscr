import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CciRoleGetRejectedIdcardsComponent } from './cci-role-get-rejected-idcards.component';

describe('CciRoleGetRejectedIdcardsComponent', () => {
  let component: CciRoleGetRejectedIdcardsComponent;
  let fixture: ComponentFixture<CciRoleGetRejectedIdcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CciRoleGetRejectedIdcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CciRoleGetRejectedIdcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
