import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartMonitoringRoutes } from './smart-monitoring-routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(SmartMonitoringRoutes),
  ]
})
export class SmartMonitoringModule { }
