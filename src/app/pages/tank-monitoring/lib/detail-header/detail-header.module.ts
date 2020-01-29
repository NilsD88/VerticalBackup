import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailHeaderComponent} from './detail-header.component';
import { MatTooltipModule, MatDialogModule } from '@angular/material';
import {ImgFallbackModule} from 'ngx-img-fallback';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TankMonitoringLocationPopupModule } from '../location-popup/location-popup.module';
import { TankMonitoringLocationPopupComponent } from '../location-popup/location-popup.component';

@NgModule({
  declarations: [DetailHeaderComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ImgFallbackModule,
    MatDialogModule,
    TankMonitoringLocationPopupModule,
    NgxSkeletonLoaderModule,
    IconModule
  ],
  exports: [DetailHeaderComponent],
  entryComponents: [
    TankMonitoringLocationPopupComponent,
  ]
})
export class DetailHeaderModule {
}
