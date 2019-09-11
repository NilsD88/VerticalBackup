import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdTemplatesDetailItemBooleanComponent } from './threshold-templates-detail-item-boolean.component';

describe('ThresholdTemplatesDetailItemBooleanComponent', () => {
  let component: ThresholdTemplatesDetailItemBooleanComponent;
  let fixture: ComponentFixture<ThresholdTemplatesDetailItemBooleanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdTemplatesDetailItemBooleanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdTemplatesDetailItemBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
