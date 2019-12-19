import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StairwayCountChartComponent } from './stairway-count-chart.component';

describe('StairwayCountChartComponent', () => {
  let component: StairwayCountChartComponent;
  let fixture: ComponentFixture<StairwayCountChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StairwayCountChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StairwayCountChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
