import { TankMonitoringMapPopupComponent } from './../map-popup/map-popup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TankMonitoringMapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TankMonitoringMapComponent,
    TankMonitoringMapPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    MatButtonModule,
    IconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports: [
    TankMonitoringMapComponent
  ],
})
export class TankMonitoringMapModule { }
