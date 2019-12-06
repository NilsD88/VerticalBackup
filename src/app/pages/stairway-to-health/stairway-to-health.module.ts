import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StairwayToHealthRoutes } from './stairway-to-health.routing';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(StairwayToHealthRoutes)
  ]
})
export class StairwayToHealthModule { }
