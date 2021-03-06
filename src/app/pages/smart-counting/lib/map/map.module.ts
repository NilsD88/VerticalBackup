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
import { SmartCountingMapComponent } from './map.component';
import { SmartCountingMapPopupComponent } from './popup/popup.component';
import { MapDialogComponent } from 'projects/ngx-proximus/src/lib/map-dialog/map-dialog.component';

@NgModule({
  declarations: [
    SmartCountingMapComponent,
    SmartCountingMapPopupComponent
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
    SmartCountingMapComponent,
    SmartCountingMapPopupComponent
  ],
  entryComponents: [
    SmartCountingMapPopupComponent,
    MapDialogComponent
  ]
})
export class SmartCountingMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('smartcounting-map-popup-element')) {
      const SmartCountingMapPopupElement = createCustomElement(SmartCountingMapPopupComponent, {injector});
      customElements.define('smartcounting-map-popup-element', SmartCountingMapPopupElement);
    }
  }
}
