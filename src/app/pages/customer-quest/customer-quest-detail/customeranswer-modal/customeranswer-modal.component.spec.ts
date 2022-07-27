import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeranswerModalComponent } from './customeranswer-modal.component';

describe('CustomeranswerModalComponent', () => {
  let component: CustomeranswerModalComponent;
  let fixture: ComponentFixture<CustomeranswerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomeranswerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeranswerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
