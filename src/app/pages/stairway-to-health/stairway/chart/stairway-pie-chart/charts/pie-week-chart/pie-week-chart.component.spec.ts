import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieWeekChartComponent } from './pie-week-chart.component';

describe('PieWeekChartComponent', () => {
  let component: PieWeekChartComponent;
  let fixture: ComponentFixture<PieWeekChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieWeekChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieWeekChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
