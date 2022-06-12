import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestItemEditComponent } from './quest-item-edit.component';

describe('QuestItemEditComponent', () => {
  let component: QuestItemEditComponent;
  let fixture: ComponentFixture<QuestItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestItemEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
