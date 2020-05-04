import { TranslateModule } from '@ngx-translate/core';
import { MapDialogComponent } from 'projects/ngx-proximus/src/lib/map-dialog/map-dialog.component';
import { WalkingTrailsMapPopupComponent } from './popup/popup.component';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkingTrailsMapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { RouterModule } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { MapDialogModule } from 'projects/ngx-proximus/src/lib/map-dialog/map-dialog.module';

@NgModule({
  declarations: [
    WalkingTrailsMapComponent,
    WalkingTrailsMapPopupComponent
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
    MapDialogModule,
    TranslateModule
  ],
  exports: [
    WalkingTrailsMapComponent,
    WalkingTrailsMapPopupComponent
  ],
  entryComponents: [
    WalkingTrailsMapPopupComponent,
    MapDialogComponent
  ]
})
export class WalkingTrailsMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('walkingtrails-map-popup-element')) {
      const WalkingTrailsMapPopupElement = createCustomElement(WalkingTrailsMapPopupComponent, {injector});
      customElements.define('walkingtrails-map-popup-element', WalkingTrailsMapPopupElement);
    }
  }
}
