import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Stairway2Health} from './stairway-2-health.routing'
import { RouterModule } from '@angular/router';







@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(Stairway2Health)
  ]
})
export class Stairway2HealthModule { }
