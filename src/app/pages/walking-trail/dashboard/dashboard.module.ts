import { TotalCountPastWeekModule } from './charts/total-count-past-week/total-count-past-week.module';
import { WalkingTrailMapModule } from '../lib/map/map.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    WalkingTrailMapModule,
    TotalCountPastWeekModule
  ]
})
export class DashboardModule { }
