import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatedValuesComponent } from './aggregated-values.component';

describe('AggregatedValuesComponent', () => {
  let component: AggregatedValuesComponent;
  let fixture: ComponentFixture<AggregatedValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregatedValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregatedValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
