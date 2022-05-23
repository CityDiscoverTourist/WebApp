import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestTypeCreateComponent } from './quest-type-create.component';

describe('QuestTypeCreateComponent', () => {
  let component: QuestTypeCreateComponent;
  let fixture: ComponentFixture<QuestTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestTypeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
