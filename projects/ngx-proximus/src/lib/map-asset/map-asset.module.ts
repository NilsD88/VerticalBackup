import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapAssetComponent } from './map-asset.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule } from '@angular/material';
import { MapAssetPopupComponent } from '../map-asset-popup/map-asset-popup.component';
import { createCustomElement } from '@angular/elements';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MapAssetComponent,
    MapAssetPopupComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    TranslateModule,
    MatButtonModule,
    IconModule,
  ],
  exports: [MapAssetComponent],
  entryComponents: [MapAssetPopupComponent]
})
export class MapAssetModule {
  constructor(private injector: Injector) {
    if (!customElements.get('popup-element')) {
      const MapAssetPopupElement = createCustomElement(MapAssetPopupComponent, {injector});
      customElements.define('popup-element', MapAssetPopupElement);
    }
  }
}
