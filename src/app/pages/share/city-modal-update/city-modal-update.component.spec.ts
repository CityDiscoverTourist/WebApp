import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityModalUpdateComponent } from './city-modal-update.component';

describe('CityModalUpdateComponent', () => {
  let component: CityModalUpdateComponent;
  let fixture: ComponentFixture<CityModalUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityModalUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityModalUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
