import { PieTotalChartModule } from './charts/pie-total-chart/pie-total-chart.module';
import { PieDayChartModule } from './charts/pie-day-chart/pie-day-chart.module';
import { PieWeekChartModule } from './charts/pie-week-chart/pie-week-chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StairwayPieChartComponent } from './stairway-pie-chart.component';
import { RouterModule } from '@angular/router';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {StairWayPieChartRoutes} from './stairway-pie-chart.routing';







@NgModule({
  declarations: [StairwayPieChartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StairWayPieChartRoutes),
    LoaderModule, 
    PieWeekChartModule,
    PieDayChartModule,
    PieTotalChartModule

  ]
})
export class StairwayPieChartModule { }
