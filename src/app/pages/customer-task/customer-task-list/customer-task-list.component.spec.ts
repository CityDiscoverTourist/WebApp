import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTaskListComponent } from './customer-task-list.component';

describe('CustomerTaskListComponent', () => {
  let component: CustomerTaskListComponent;
  let fixture: ComponentFixture<CustomerTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
