import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeSliderComponent } from './range-slider.component';
import {NouisliderModule} from 'ng2-nouislider';

@NgModule({
  declarations: [RangeSliderComponent],
  imports: [
    CommonModule,
    NouisliderModule
  ],
  exports: [RangeSliderComponent]
})
export class RangeSliderModule { }
