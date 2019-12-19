import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PeopleCountingDetailHeaderComponent} from './detail-header.component';
import { MatTooltipModule, MatDialogModule } from '@angular/material';
import {ImgFallbackModule} from 'ngx-img-fallback';
import { LocationPopupModule } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.module';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [PeopleCountingDetailHeaderComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ImgFallbackModule,
    MatDialogModule,
    LocationPopupModule,
    NgxSkeletonLoaderModule,
    IconModule
  ],
  exports: [PeopleCountingDetailHeaderComponent],
  entryComponents: [
    LocationPopupComponent,
  ]
})
export class PeopleCountingDetailHeaderModule {
}
