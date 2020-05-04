import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCountChartComponent } from './total-count-chart.component';

describe('TotalCountChartComponent', () => {
  let component: TotalCountChartComponent;
  let fixture: ComponentFixture<TotalCountChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalCountChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCountChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
