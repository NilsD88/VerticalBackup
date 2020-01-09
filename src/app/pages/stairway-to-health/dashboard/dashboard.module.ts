import { StairwayToHealthDashboardStatisticsModule } from './charts/statistics/statistics.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import {DashboardRoutes} from './dashboard.routing';
import { MatButtonToggleModule, MatIconModule } from '@angular/material';
import { LocationExplorerModule } from '../../../../../projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { TotalCountPastYearModule } from '../../../../../src/app/shared/people-counting/dashboard/charts/total-count-past-year/total-count-past-year.module';
import { StairwayToHealthMapModule } from '../lib/map/map.module';
import { StairwayToHealthDashboardTotalCountModule } from './charts/total-count/total-count-chart.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MatButtonToggleModule,
    MatIconModule,
    LocationExplorerModule,
    StairwayToHealthMapModule,
    TotalCountPastYearModule,
    StairwayToHealthDashboardTotalCountModule,
    StairwayToHealthDashboardStatisticsModule
  ]
})
export class DashboardModule { }
