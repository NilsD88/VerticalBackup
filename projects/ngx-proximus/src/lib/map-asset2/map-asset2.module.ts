import { AlertsService } from './../../../../../src/app/services/alerts.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapAsset2Component } from './map-asset2.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    MapAsset2Component,
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    MatButtonModule,
    IconModule,
  ],
  exports: [MapAsset2Component],
  providers: [
    AlertsService
  ]
})
export class MapAsset2Module {
}
