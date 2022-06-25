import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuestDetailComponent } from './customer-quest-detail.component';

describe('CustomerQuestDetailComponent', () => {
  let component: CustomerQuestDetailComponent;
  let fixture: ComponentFixture<CustomerQuestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerQuestDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerQuestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
