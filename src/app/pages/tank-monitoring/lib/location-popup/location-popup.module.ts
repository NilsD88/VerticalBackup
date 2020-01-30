import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TankMonitoringLocationPopupComponent } from './location-popup.component';
import { MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { AssetExplorerModule } from 'projects/ngx-proximus/src/lib/asset-explorer/asset-explorer.module';

@NgModule({
  declarations: [TankMonitoringLocationPopupComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    AssetExplorerModule,
    MatIconModule,
    MapModule,
    MatProgressSpinnerModule
  ],
  providers: [
    NewLocationService
  ]
})
export class TankMonitoringLocationPopupModule { }
