import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTaskComponent } from './customer-task.component';

describe('CustomerTaskComponent', () => {
  let component: CustomerTaskComponent;
  let fixture: ComponentFixture<CustomerTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
