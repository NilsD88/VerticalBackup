import { TranslateModule } from '@ngx-translate/core';
import { DetailHeaderListThingsModule } from './../../../../../../projects/ngx-proximus/src/lib/detail-header/list-things/list-things.module';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailHeaderComponent} from './detail-header.component';
import { MatTooltipModule, MatDialogModule } from '@angular/material';
import {ImgFallbackModule} from 'ngx-img-fallback';
import { LocationPopupModule } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.module';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DetailHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatTooltipModule,
    ImgFallbackModule,
    MatDialogModule,
    LocationPopupModule,
    NgxSkeletonLoaderModule,
    IconModule,
    DetailHeaderListThingsModule
  ],
  exports: [DetailHeaderComponent],
  entryComponents: [
    LocationPopupComponent,
  ]
})
export class DetailHeaderModule {
}
