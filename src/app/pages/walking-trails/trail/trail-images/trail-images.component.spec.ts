import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailImagesComponent } from './trail-images.component';

describe('TrailImagesComponent', () => {
  let component: TrailImagesComponent;
  let fixture: ComponentFixture<TrailImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
