import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPopupComponent } from './location-popup.component';
import { MapModule } from '../map/map.module';
import { MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { NewLocationService } from 'src/app/services/new-location.service';

@NgModule({
  declarations: [LocationPopupComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    LocationExplorerModule,
    MatIconModule,
    MapModule,
    MatProgressSpinnerModule
  ],
  providers: [
    NewLocationService
  ]
})
export class LocationPopupModule { }
