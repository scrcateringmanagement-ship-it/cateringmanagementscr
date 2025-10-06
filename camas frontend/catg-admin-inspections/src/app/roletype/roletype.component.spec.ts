import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoletypeComponent } from './roletype.component';

describe('RoletypeComponent', () => {
  let component: RoletypeComponent;
  let fixture: ComponentFixture<RoletypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoletypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoletypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
