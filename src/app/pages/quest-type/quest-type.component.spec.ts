import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestTypeComponent } from './quest-type.component';

describe('QuestTypeComponent', () => {
  let component: QuestTypeComponent;
  let fixture: ComponentFixture<QuestTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
