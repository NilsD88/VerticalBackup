import {MatIconModule, MatSnackBarModule} from '@angular/material';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapNewLocationComponent} from './map-new-location.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    MapNewLocationComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    MatSnackBarModule,
    MatIconModule,
    TranslateModule
  ],
  exports: [MapNewLocationComponent]
})
export class MapNewLocation {
}
