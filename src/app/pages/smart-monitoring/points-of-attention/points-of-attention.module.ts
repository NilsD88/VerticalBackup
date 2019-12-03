import { PointsOfAttentionRoutes } from './points-of-attention.routing';
import { RouterModule } from '@angular/router';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointsOfAttentionComponent } from './points-of-attention.component';



@NgModule({
  declarations: [PointsOfAttentionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PointsOfAttentionRoutes),
    LocationExplorerModule
  ]
})
export class PointsOfAttentionModule { }
