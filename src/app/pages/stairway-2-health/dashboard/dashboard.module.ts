import { Stairway2HealthDashboardStatisticsModule } from './charts/statistics/statistics.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import {DashboardRoutes} from './dashboard.routing';
import { MatButtonToggleModule, MatIconModule } from '@angular/material';
import { LocationExplorerModule } from '../../../../../projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { TotalCountPastYearModule } from '../../../../../src/app/shared/people-counting/dashboard/charts/total-count-past-year/total-count-past-year.module';
import { Stairway2HealthMapModule } from '../lib/map/map.module';
import { Stairway2HealthDashboardTotalCountModule } from './charts/total-count/total-count-chart.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MatButtonToggleModule,
    MatIconModule,
    TranslateModule,
    LocationExplorerModule,
    Stairway2HealthMapModule,
    TotalCountPastYearModule,
    Stairway2HealthDashboardTotalCountModule,
    Stairway2HealthDashboardStatisticsModule
  ]
})
export class DashboardModule { }
