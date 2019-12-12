import { PieChartModule } from './../../../../../projects/ngx-proximus/src/lib/pie-chart/pie-chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import {DashboardRoutes} from './dashboard.routing';
import { MatButtonToggleModule, MatIconModule } from '@angular/material';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { CountPastWeekModule } from 'src/app/shared/people-counting/dashboard/charts/count-past-week/count-past-week.module';
import { TotalCountPastWeekModule } from 'src/app/shared/people-counting/dashboard/charts/total-count-past-week/total-count-past-week.module';
import { TotalCountPastYearModule } from 'src/app/shared/people-counting/dashboard/charts/total-count-past-year/total-count-past-year.module';
import { PeopleCountingRetailMapModule } from '../lib/map/map.module';





@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MatButtonToggleModule,
    MatIconModule,
    LocationExplorerModule,
    PeopleCountingRetailMapModule,
    CountPastWeekModule,
    TotalCountPastWeekModule,
    TotalCountPastYearModule,
  ]
})
export class DashboardModule { }
