import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestCreateComponent } from './quest-create.component';

describe('QuestCreateComponent', () => {
  let component: QuestCreateComponent;
  let fixture: ComponentFixture<QuestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
