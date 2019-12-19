import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StairwayPieChartComponent } from './stairway-pie-chart.component';

describe('StairwayPieChartComponent', () => {
  let component: StairwayPieChartComponent;
  let fixture: ComponentFixture<StairwayPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StairwayPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StairwayPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
