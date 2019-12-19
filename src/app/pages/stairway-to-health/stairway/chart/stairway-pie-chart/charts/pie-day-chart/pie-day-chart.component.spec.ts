import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieDayChartComponent } from './pie-day-chart.component';

describe('PieDayChartComponent', () => {
  let component: PieDayChartComponent;
  let fixture: ComponentFixture<PieDayChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieDayChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieDayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
