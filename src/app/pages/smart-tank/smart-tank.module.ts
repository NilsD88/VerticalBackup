import { SmartTankRoutes } from './smart-tank.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(SmartTankRoutes),
  ],
})
export class SmartTankModule { }
