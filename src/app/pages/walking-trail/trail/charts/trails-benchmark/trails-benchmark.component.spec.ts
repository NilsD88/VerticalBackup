import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailsBenchmarkComponent } from './trails-benchmark.component';

describe('TrailsBenchmarkComponent', () => {
  let component: TrailsBenchmarkComponent;
  let fixture: ComponentFixture<TrailsBenchmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailsBenchmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailsBenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
