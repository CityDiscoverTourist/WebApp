import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuestListComponent } from './customer-quest-list.component';

describe('CustomerQuestListComponent', () => {
  let component: CustomerQuestListComponent;
  let fixture: ComponentFixture<CustomerQuestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerQuestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerQuestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
