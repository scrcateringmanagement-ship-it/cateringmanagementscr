import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardingInspectionsComponent } from './forwarding-inspections.component';

describe('ForwardingInspectionsComponent', () => {
  let component: ForwardingInspectionsComponent;
  let fixture: ComponentFixture<ForwardingInspectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForwardingInspectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwardingInspectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
