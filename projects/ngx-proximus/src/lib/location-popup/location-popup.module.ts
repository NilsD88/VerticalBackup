import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPopupComponent } from './location-popup.component';
import { MapModule } from '../map/map.module';
import { MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { LocationService } from 'src/app/services/location.service';
import { AssetExplorerModule } from '../asset-explorer/asset-explorer.module';

@NgModule({
  declarations: [LocationPopupComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    AssetExplorerModule,
    MatIconModule,
    MapModule,
    MatProgressSpinnerModule
  ],
  providers: [
    LocationService
  ]
})
export class LocationPopupModule { }
