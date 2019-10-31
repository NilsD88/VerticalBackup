import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MapDialogComponent } from './map-dialog.component';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { createCustomElement } from '@angular/elements';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MapComponent,
    MapDialogComponent,
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
    MatDialogModule
  ],
  exports: [MapComponent],
  providers: [
    NewAssetService,
    NewLocationService
  ],
  entryComponents: [
    MapDialogComponent,
    MapPopupComponent
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
