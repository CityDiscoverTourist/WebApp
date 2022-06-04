import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestItemComponent } from './quest-item.component';

describe('QuestItemComponent', () => {
  let component: QuestItemComponent;
  let fixture: ComponentFixture<QuestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
