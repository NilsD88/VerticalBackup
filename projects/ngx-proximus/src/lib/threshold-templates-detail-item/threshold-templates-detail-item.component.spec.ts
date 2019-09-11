import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdTemplatesDetailItemComponent } from './threshold-templates-detail-item.component';

describe('ThresholdTemplatesDetailItemComponent', () => {
  let component: ThresholdTemplatesDetailItemComponent;
  let fixture: ComponentFixture<ThresholdTemplatesDetailItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdTemplatesDetailItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdTemplatesDetailItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
