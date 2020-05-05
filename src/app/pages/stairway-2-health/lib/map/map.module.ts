import { TranslateModule } from '@ngx-translate/core';
import { MapDialogModule } from './../../../../../../projects/ngx-proximus/src/lib/map-dialog/map-dialog.module';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { RouterModule } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { Stairway2HealthMapComponent } from './map.component';
import { Stairway2HealthMapPopupComponent } from './popup/popup.component';
import { MapDialogComponent } from 'projects/ngx-proximus/src/lib/map-dialog/map-dialog.component';

@NgModule({
  declarations: [
    Stairway2HealthMapComponent,
    Stairway2HealthMapPopupComponent
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
    Stairway2HealthMapComponent,
    Stairway2HealthMapPopupComponent
  ],
  entryComponents: [
    Stairway2HealthMapPopupComponent,
    MapDialogComponent
  ]
})
export class Stairway2HealthMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('stairway2health-map-popup-element')) {
      const Stairway2HealthMapPopupElement = createCustomElement(Stairway2HealthMapPopupComponent, {injector});
      customElements.define('stairway2health-map-popup-element', Stairway2HealthMapPopupElement);
    }
  }
}
