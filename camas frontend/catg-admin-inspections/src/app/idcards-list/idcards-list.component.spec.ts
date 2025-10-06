import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardsListComponent } from './idcards-list.component';

describe('IdcardsListComponent', () => {
  let component: IdcardsListComponent;
  let fixture: ComponentFixture<IdcardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdcardsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
