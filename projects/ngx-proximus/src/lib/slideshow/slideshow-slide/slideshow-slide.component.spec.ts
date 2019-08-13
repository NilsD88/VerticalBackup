import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowSlideComponent } from './slideshow-slide.component';

describe('SlideshowSlideComponent', () => {
  let component: SlideshowSlideComponent;
  let fixture: ComponentFixture<SlideshowSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideshowSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideshowSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
