import { TankMonitoringRoutes } from './tank-monitoring.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(TankMonitoringRoutes),
  ],
})
export class TankMonitoringModule { }
