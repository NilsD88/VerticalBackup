import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdTemplatesDetailComponent } from './threshold-templates-detail.component';

describe('ThresholdTemplatesDetailComponent', () => {
  let component: ThresholdTemplatesDetailComponent;
  let fixture: ComponentFixture<ThresholdTemplatesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdTemplatesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdTemplatesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
