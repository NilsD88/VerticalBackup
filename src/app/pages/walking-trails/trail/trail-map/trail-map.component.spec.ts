import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailMapComponent } from './trail-map.component';

describe('TrailMapComponent', () => {
  let component: TrailMapComponent;
  let fixture: ComponentFixture<TrailMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
