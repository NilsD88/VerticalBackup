import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { MatButtonToggleModule, MatIconModule } from '@angular/material';
import { TotalCountPastYearModule } from './charts/total-count-past-year/total-count-past-year.module';
import { TotalCountPastWeekModule } from './charts/total-count-past-week/total-count-past-week.module';
import { CountPastWeekModule } from './charts/count-past-week/count-past-week.module';
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
    MatButtonToggleModule,
    MatIconModule,
    LocationExplorerModule,
    WalkingTrailMapModule,
    CountPastWeekModule,
    TotalCountPastWeekModule,
    TotalCountPastYearModule,
  ]
})
export class DashboardModule {}
