import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdTemplatesDetailItemCounterComponent } from './threshold-templates-detail-item-counter.component';

describe('ThresholdTemplatesDetailItemCounterComponent', () => {
  let component: ThresholdTemplatesDetailItemCounterComponent;
  let fixture: ComponentFixture<ThresholdTemplatesDetailItemCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdTemplatesDetailItemCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdTemplatesDetailItemCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
