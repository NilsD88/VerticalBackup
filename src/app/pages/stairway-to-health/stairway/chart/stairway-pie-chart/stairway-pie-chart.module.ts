import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StairwayPieChartComponent } from './stairway-pie-chart.component';
import { RouterModule } from '@angular/router';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {StairWayPieChartRoutes} from './stairway-pie-chart.routing';
import { PieChartModule } from 'projects/ngx-proximus/src/lib/pie-chart/pie-chart.module';
import { PieDayChartComponent } from './charts/pie-day-chart/pie-day-chart.component';
import { PieTotalChartComponent } from './charts/pie-total-chart/pie-total-chart.component';
import { PieWeekChartComponent } from './charts/pie-week-chart/pie-week-chart.component';





@NgModule({
  declarations: [StairwayPieChartComponent, PieDayChartComponent, PieTotalChartComponent, PieWeekChartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StairWayPieChartRoutes),
    LoaderModule, 
    PieChartModule

  ]
})
export class StairwayPieChartModule { }
