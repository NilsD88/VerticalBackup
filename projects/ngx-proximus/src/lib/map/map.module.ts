import { MapDialogComponent } from './../map-dialog/map-dialog.component';
import { MapDialogModule } from './../map-dialog/map-dialog.module';
import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { AssetService } from 'src/app/services/asset.service';
import { LocationService } from 'src/app/services/location.service';
import { MapPopupComponent } from './popup/popup.component';
import { createCustomElement } from '@angular/elements';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MapComponent,
    MapPopupComponent
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
    MapDialogModule
  ],
  exports: [MapComponent],
  providers: [
    AssetService,
    LocationService
  ],
  entryComponents: [
    MapPopupComponent,
    MapDialogComponent
  ]
})
export class MapModule {
  constructor(private injector: Injector) {
    if (!customElements.get('map-popup-element')) {
      const MapPopupElement = createCustomElement(MapPopupComponent, {injector});
      customElements.define('map-popup-element', MapPopupElement);
    }
  }
}
