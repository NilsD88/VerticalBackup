import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideshowComponent } from './slideshow.component';
import { SlideshowSlideComponent } from './slideshow-slide/slideshow-slide.component';

@NgModule({
  declarations: [SlideshowComponent, SlideshowSlideComponent],
  imports: [
    CommonModule
  ],
  exports: [
    SlideshowComponent, SlideshowSlideComponent
  ]
})
export class SlideshowModule { }
