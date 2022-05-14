import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestOwnerLayoutComponent } from './quest-owner-layout.component';

describe('QuestOwnerLayoutComponent', () => {
  let component: QuestOwnerLayoutComponent;
  let fixture: ComponentFixture<QuestOwnerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestOwnerLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestOwnerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
