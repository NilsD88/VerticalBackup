import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TrailImagesComponent } from './trail-images.component';
import { MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { SlideshowModule } from 'ng-simple-slideshow';


@NgModule({
  declarations: [TrailImagesComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatCardModule,
    SlideshowModule,
    TranslateModule
  ],
  exports: [TrailImagesComponent]
})
export class TrailImagesModule {
}
