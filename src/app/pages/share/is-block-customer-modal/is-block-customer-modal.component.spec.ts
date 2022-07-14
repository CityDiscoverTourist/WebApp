import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsBlockCustomerModalComponent } from './is-block-customer-modal.component';

describe('IsBlockCustomerModalComponent', () => {
  let component: IsBlockCustomerModalComponent;
  let fixture: ComponentFixture<IsBlockCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsBlockCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsBlockCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
