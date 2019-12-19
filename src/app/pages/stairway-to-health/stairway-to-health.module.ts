import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StairwayToHealth} from './stairway-to-health.routing'
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(StairwayToHealth)
  ]
})
export class StairwayToHealthModule { }
