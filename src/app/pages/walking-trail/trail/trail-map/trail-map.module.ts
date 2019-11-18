import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailMapComponent } from './trail-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';



@NgModule({
  declarations: [TrailMapComponent],
  imports: [
    CommonModule,
    RouterModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
  ],
  exports: [TrailMapComponent]
})
export class TrailMapModule { }
