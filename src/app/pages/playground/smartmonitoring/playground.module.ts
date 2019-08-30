import { LocationExplorerModule } from './../../../../../projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import {RouterModule} from '@angular/router';
import {PlaygroundRoutes} from './playground.routing';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { NewLocationService } from 'src/app/services/new-location.service';
@NgModule({
  declarations: [
    PlaygroundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PlaygroundRoutes),
    MapModule,
    LocationExplorerModule
  ],
  providers: [
    NewLocationService
  ]
})
export class PlaygroundModule { }
