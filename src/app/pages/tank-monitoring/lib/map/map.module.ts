import { TankMonitoringMapPopupComponent } from './popup/popup.component';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TankMonitoringMapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { RouterModule } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { MapDialogComponent } from 'projects/ngx-proximus/src/lib/map/map-dialog.component';

@NgModule({
  declarations: [
    TankMonitoringMapComponent,
    TankMonitoringMapPopupComponent,
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
    TankMonitoringMapComponent,
    TankMonitoringMapPopupComponent
  ],
  entryComponents: [
    TankMonitoringMapPopupComponent,
    MapDialogComponent,
    MapPopupComponent
  ]
})
export class TankMonitoringMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('tankmonitoring-map-popup-element')) {
      const TankMonitoringMapPopupElement = createCustomElement(TankMonitoringMapPopupComponent, {injector});
      customElements.define('tankmonitoring-map-popup-element', TankMonitoringMapPopupElement);
    }
    if (!customElements.get('map-popup-element')) {
      const MapPopupElement = createCustomElement(MapPopupComponent, {injector});
      customElements.define('map-popup-element', MapPopupElement);
    }
  }
}
