import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkingTrailsRoutes } from './walking-trails.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(WalkingTrailsRoutes),
  ]
})
export class WalkingTrailsModule { }
