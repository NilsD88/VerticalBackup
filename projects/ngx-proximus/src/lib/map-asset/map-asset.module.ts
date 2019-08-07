import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapAssetComponent } from './map-asset.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    MapAssetComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    MatButtonModule,
    IconModule,
  ],
  exports: [MapAssetComponent]
})
export class MapAssetModule {
}
