import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestItemCreateComponent } from './quest-item-create.component';

describe('QuestItemCreateComponent', () => {
  let component: QuestItemCreateComponent;
  let fixture: ComponentFixture<QuestItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestItemCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
