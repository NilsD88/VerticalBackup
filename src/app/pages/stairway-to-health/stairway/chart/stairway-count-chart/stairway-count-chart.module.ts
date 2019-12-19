
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StairwayCountChartComponent } from './stairway-count-chart.component';
import { RouterModule } from '@angular/router';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {StairWayCountChartRoutes} from './stairway-count-chart.routing';
import { ChartControlsModule } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.module';




@NgModule({
  declarations: [StairwayCountChartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StairWayCountChartRoutes),
    LoaderModule, 
    ChartControlsModule
  ]
})
export class StairwayCountChartModule { }
