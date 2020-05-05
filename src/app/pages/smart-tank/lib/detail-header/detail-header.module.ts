import { TranslateModule } from '@ngx-translate/core';
import { DetailHeaderListThingsModule } from './../../../../../../projects/ngx-proximus/src/lib/detail-header/list-things/list-things.module';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailHeaderComponent} from './detail-header.component';
import { MatTooltipModule, MatDialogModule } from '@angular/material';
import {ImgFallbackModule} from 'ngx-img-fallback';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SmartTankLocationPopupModule } from '../location-popup/location-popup.module';
import { SmartTankLocationPopupComponent } from '../location-popup/location-popup.component';

@NgModule({
  declarations: [DetailHeaderComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ImgFallbackModule,
    MatDialogModule,
    SmartTankLocationPopupModule,
    NgxSkeletonLoaderModule,
    IconModule,
    DetailHeaderListThingsModule,
    TranslateModule
  ],
  exports: [DetailHeaderComponent],
  entryComponents: [
    SmartTankLocationPopupComponent,
  ]
})
export class DetailHeaderModule {
}
