import { TankMonitoringRoutes } from './tank-monitoring.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TankMonitoringMapPopupComponent } from './lib/map-popup/map-popup.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(TankMonitoringRoutes),
  ],
})
export class TankMonitoringModule { }
