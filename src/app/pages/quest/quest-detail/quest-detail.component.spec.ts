import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestDetailComponent } from './quest-detail.component';

describe('QuestDetailComponent', () => {
  let component: QuestDetailComponent;
  let fixture: ComponentFixture<QuestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
