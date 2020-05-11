import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {SmartCountingRoutes} from './smart-counting.routing'





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(SmartCountingRoutes)
  ]
})
export class SmartCountingModule { }
