import { AlertsService } from './../../../../../src/app/services/alerts.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapComponent } from './map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MapDialogComponent } from './map-dialog.component';

@NgModule({
  declarations: [
    MapComponent,
    MapDialogComponent
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    MatButtonModule,
    IconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports: [MapComponent],
  providers: [
    AlertsService,
    NewAssetService,
    NewLocationService
  ],
  entryComponents: [
    MapDialogComponent
  ]
})
export class MapModule {
}
