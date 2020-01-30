import { PointOfAttentionExplorerModule } from 'projects/ngx-proximus/src/lib/point-of-attention-explorer/point-of-attention-explorer.module';
import { PointsOfAttentionRoutes } from './points-of-attention.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointsOfAttentionComponent } from './points-of-attention.component';



@NgModule({
  declarations: [PointsOfAttentionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PointsOfAttentionRoutes),
    PointOfAttentionExplorerModule
  ]
})
export class PointsOfAttentionModule { }
