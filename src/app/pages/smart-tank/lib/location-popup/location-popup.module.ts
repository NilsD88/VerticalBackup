import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTankLocationPopupComponent } from './location-popup.component';
import { MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { LocationService } from 'src/app/services/location.service';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { AssetExplorerModule } from 'projects/ngx-proximus/src/lib/asset-explorer/asset-explorer.module';

@NgModule({
  declarations: [SmartTankLocationPopupComponent],
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
export class SmartTankLocationPopupModule { }
