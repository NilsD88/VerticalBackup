import { TranslateModule } from '@ngx-translate/core';
import { MapDialogComponent } from './../../../../../../projects/ngx-proximus/src/lib/map-dialog/map-dialog.component';
import { MapDialogModule } from './../../../../../../projects/ngx-proximus/src/lib/map-dialog/map-dialog.module';
import { SmartTankMapPopupComponent } from './popup/popup.component';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTankMapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { RouterModule } from '@angular/router';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    SmartTankMapComponent,
    SmartTankMapPopupComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    MatButtonModule,
    IconModule,
    MatSnackBarModule,
    MapDialogModule,
    MatDialogModule,
    TranslateModule
  ],
  exports: [
    SmartTankMapComponent,
    SmartTankMapPopupComponent
  ],
  entryComponents: [
    SmartTankMapPopupComponent,
    MapDialogComponent
  ]
})
export class SmartTankMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('smarttank-map-popup-element')) {
      const SmartTankMapPopupElement = createCustomElement(SmartTankMapPopupComponent, {injector});
      customElements.define('smarttank-map-popup-element', SmartTankMapPopupElement);
    }
  }
}
