import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorydeficiencyComponent } from './categorydeficiency.component';

describe('CategorydeficiencyComponent', () => {
  let component: CategorydeficiencyComponent;
  let fixture: ComponentFixture<CategorydeficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorydeficiencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorydeficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
