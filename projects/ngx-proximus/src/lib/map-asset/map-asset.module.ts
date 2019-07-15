import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapAssetComponent } from './map-asset.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    MapAssetComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [MapAssetComponent]
})
export class MapAssetModule {
}
