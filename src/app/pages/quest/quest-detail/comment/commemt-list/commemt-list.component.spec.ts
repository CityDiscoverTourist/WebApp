import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommemtListComponent } from './commemt-list.component';

describe('CommemtListComponent', () => {
  let component: CommemtListComponent;
  let fixture: ComponentFixture<CommemtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommemtListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommemtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
