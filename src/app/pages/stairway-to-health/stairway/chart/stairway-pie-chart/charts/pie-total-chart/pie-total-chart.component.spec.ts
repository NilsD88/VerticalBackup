import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieTotalChartComponent } from './pie-total-chart.component';

describe('PieTotalChartComponent', () => {
  let component: PieTotalChartComponent;
  let fixture: ComponentFixture<PieTotalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieTotalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieTotalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
