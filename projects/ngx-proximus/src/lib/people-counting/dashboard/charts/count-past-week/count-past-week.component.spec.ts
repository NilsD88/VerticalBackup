import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountPastWeekComponent } from './count-past-week.component';

describe('CountPastWeekComponent', () => {
  let component: CountPastWeekComponent;
  let fixture: ComponentFixture<CountPastWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountPastWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountPastWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
