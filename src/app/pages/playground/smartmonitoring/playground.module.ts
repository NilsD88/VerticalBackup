import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import {RouterModule} from '@angular/router';
import {PlaygroundRoutes} from './playground.routing';
import { MapAssetModule } from 'projects/ngx-proximus/src/lib/map-asset/map-asset.module';
@NgModule({
  declarations: [
    PlaygroundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PlaygroundRoutes),
    MapAssetModule,
  ]
})
export class PlaygroundModule { }
