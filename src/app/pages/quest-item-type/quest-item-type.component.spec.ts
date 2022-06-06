import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestItemTypeComponent } from './quest-item-type.component';

describe('QuestItemTypeComponent', () => {
  let component: QuestItemTypeComponent;
  let fixture: ComponentFixture<QuestItemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestItemTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
