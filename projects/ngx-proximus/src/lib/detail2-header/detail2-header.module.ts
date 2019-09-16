import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Detail2HeaderComponent} from './detail2-header.component';
import { MatTooltipModule, MatDialogModule } from '@angular/material';
import {ImgFallbackModule} from 'ngx-img-fallback';
import { LocationPopupModule } from '../location-popup/location-popup.module';
import { LocationPopupComponent } from '../location-popup/location-popup.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [Detail2HeaderComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ImgFallbackModule,
    MatDialogModule,
    LocationPopupModule,
    NgxSkeletonLoaderModule
  ],
  exports: [Detail2HeaderComponent],
  entryComponents: [
    LocationPopupComponent,
  ]
})
export class Detail2HeaderModule {
}
