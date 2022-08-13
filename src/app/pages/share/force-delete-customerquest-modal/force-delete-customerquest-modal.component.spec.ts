import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDeleteCustomerquestModalComponent } from './force-delete-customerquest-modal.component';

describe('ForceDeleteCustomerquestModalComponent', () => {
  let component: ForceDeleteCustomerquestModalComponent;
  let fixture: ComponentFixture<ForceDeleteCustomerquestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForceDeleteCustomerquestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDeleteCustomerquestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
