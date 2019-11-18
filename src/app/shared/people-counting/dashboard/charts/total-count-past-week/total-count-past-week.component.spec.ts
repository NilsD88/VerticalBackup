import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCountPastWeekComponent } from './total-count-past-week.component';

describe('TotalCountPastWeekComponent', () => {
  let component: TotalCountPastWeekComponent;
  let fixture: ComponentFixture<TotalCountPastWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalCountPastWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCountPastWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
