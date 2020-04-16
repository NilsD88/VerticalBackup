import {IconModule} from './../../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrailMapComponent} from './trail-map.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [TrailMapComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    IconModule,
    TranslateModule
  ],
  exports: [TrailMapComponent]
})
export class TrailMapModule {
}
