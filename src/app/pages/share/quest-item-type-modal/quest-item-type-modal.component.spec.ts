import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestItemTypeModalComponent } from './quest-item-type-modal.component';

describe('QuestItemTypeModalComponent', () => {
  let component: QuestItemTypeModalComponent;
  let fixture: ComponentFixture<QuestItemTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestItemTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestItemTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
