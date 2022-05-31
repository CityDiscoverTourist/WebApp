import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestDeleteModalComponent } from './quest-delete-modal.component';

describe('QuestDeleteModalComponent', () => {
  let component: QuestDeleteModalComponent;
  let fixture: ComponentFixture<QuestDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
