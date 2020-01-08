
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StairwayCountChartComponent } from './stairway-count-chart.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { ChartControlsModule } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.module';

@NgModule({
  declarations: [StairwayCountChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
    ChartControlsModule
  ],
  exports: [StairwayCountChartComponent]
})
export class StairwayCountChartModule { }
