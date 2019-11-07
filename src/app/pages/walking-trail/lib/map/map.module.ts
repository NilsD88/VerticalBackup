import { WalkingTrailMapPopupComponent } from './popup/popup.component';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkingTrailMapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { RouterModule } from '@angular/router';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    WalkingTrailMapComponent,
    WalkingTrailMapPopupComponent
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
    WalkingTrailMapComponent,
    WalkingTrailMapPopupComponent
  ],
  entryComponents: [
    WalkingTrailMapPopupComponent
  ]
})
export class WalkingTrailMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('walkingtrail-map-popup-element')) {
      const WalkingTrailMapPopupElement = createCustomElement(WalkingTrailMapPopupComponent, {injector});
      customElements.define('walkingtrail-map-popup-element', WalkingTrailMapPopupElement);
    }
  }
}
