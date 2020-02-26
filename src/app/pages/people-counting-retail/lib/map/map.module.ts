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
import { PeopleCountingRetailMapComponent } from './map.component';
import { PeopleCountingRetailMapPopupComponent } from './popup/popup.component';
import { MapDialogComponent } from 'projects/ngx-proximus/src/lib/map-dialog/map-dialog.component';

@NgModule({
  declarations: [
    PeopleCountingRetailMapComponent,
    PeopleCountingRetailMapPopupComponent
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
    PeopleCountingRetailMapComponent,
    PeopleCountingRetailMapPopupComponent
  ],
  entryComponents: [
    PeopleCountingRetailMapPopupComponent,
    MapDialogComponent
  ]
})
export class PeopleCountingRetailMapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('peoplecountingretail-map-popup-element')) {
      const PeopleCountingRetailMapPopupElement = createCustomElement(PeopleCountingRetailMapPopupComponent, {injector});
      customElements.define('peoplecountingretail-map-popup-element', PeopleCountingRetailMapPopupElement);
    }
  }
}
