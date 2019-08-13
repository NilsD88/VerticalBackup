import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapNewLocationComponent } from './map-new-location.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    MapNewLocationComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [MapNewLocationComponent]
})
export class MapNewLocation {
}
