import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestTypeModalComponent } from './quest-type-modal.component';

describe('QuestTypeModalComponent', () => {
  let component: QuestTypeModalComponent;
  let fixture: ComponentFixture<QuestTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
