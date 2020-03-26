import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrailImagesComponent} from './trail-images.component';
import {MatCardModule, MatProgressSpinnerModule} from '@angular/material';
import {SlideshowModule} from 'ng-simple-slideshow';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [TrailImagesComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    SlideshowModule,
    TranslateModule
  ],
  exports: [TrailImagesComponent]
})
export class TrailImagesModule {
}
