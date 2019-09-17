import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartControlsComponent } from './chart-controls.component';

describe('ChartControlsComponent', () => {
  let component: ChartControlsComponent;
  let fixture: ComponentFixture<ChartControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
