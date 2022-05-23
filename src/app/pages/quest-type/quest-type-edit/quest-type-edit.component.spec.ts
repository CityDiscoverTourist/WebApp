import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestTypeEditComponent } from './quest-type-edit.component';

describe('QuestTypeEditComponent', () => {
  let component: QuestTypeEditComponent;
  let fixture: ComponentFixture<QuestTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestTypeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
