import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailImagesComponent } from './trail-images.component';
import { MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { SlideshowModule } from 'ng-simple-slideshow';



@NgModule({
  declarations: [TrailImagesComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    SlideshowModule
  ],
  exports: [TrailImagesComponent]
})
export class TrailImagesModule { }
