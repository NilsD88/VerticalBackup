import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdTemplatesDetailItemNumberComponent } from './threshold-templates-detail-item-number.component';

describe('ThresholdTemplatesDetailItemNumberComponent', () => {
  let component: ThresholdTemplatesDetailItemNumberComponent;
  let fixture: ComponentFixture<ThresholdTemplatesDetailItemNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdTemplatesDetailItemNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdTemplatesDetailItemNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
