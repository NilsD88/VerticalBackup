import { MapDialogModule } from './../../../../../../projects/ngx-proximus/src/lib/map-dialog/map-dialog.module';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { RouterModule } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { StairwayToHealthMapComponent } from './map.component';
import { StairwayToHealthMapPopupComponent } from './popup/popup.component';
import { MapDialogComponent } from 'projects/ngx-proximus/src/lib/map-dialog/map-dialog.component';

@NgModule({
  declarations: [
    StairwayToHealthMapComponent,
    StairwayToHealthMapPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    MatButtonModule,
    IconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  exports: [
    StairwayToHealthMapComponent,
    StairwayToHealthMapPopupComponent
  ],
  entryComponents: [
    StairwayToHealthMapPopupComponent,
    MapDialogComponent
  ]
})
export class StairwayToHealthMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('stairwaytohealth-map-popup-element')) {
      const StairwayToHealthMapPopupElement = createCustomElement(StairwayToHealthMapPopupComponent, {injector});
      customElements.define('stairwaytohealth-map-popup-element', StairwayToHealthMapPopupElement);
    }
  }
}
