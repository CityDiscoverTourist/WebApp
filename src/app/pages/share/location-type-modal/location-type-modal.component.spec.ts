import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTypeModalComponent } from './location-type-modal.component';

describe('LocationTypeModalComponent', () => {
  let component: LocationTypeModalComponent;
  let fixture: ComponentFixture<LocationTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
