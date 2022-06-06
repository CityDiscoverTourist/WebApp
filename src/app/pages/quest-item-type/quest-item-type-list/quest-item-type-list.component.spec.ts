import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestItemTypeListComponent } from './quest-item-type-list.component';

describe('QuestItemTypeListComponent', () => {
  let component: QuestItemTypeListComponent;
  let fixture: ComponentFixture<QuestItemTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestItemTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestItemTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
