import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestEditComponent } from './quest-edit.component';

describe('QuestEditComponent', () => {
  let component: QuestEditComponent;
  let fixture: ComponentFixture<QuestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
