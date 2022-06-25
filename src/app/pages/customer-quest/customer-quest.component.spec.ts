import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuestComponent } from './customer-quest.component';

describe('CustomerQuestComponent', () => {
  let component: CustomerQuestComponent;
  let fixture: ComponentFixture<CustomerQuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerQuestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
