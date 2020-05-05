import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { PieChartModule } from './pie-chart/pie-chart.module';

@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    CommonModule,
    LoaderModule,
    PieChartModule,
  ],
  exports: [StatisticsComponent]
})
export class Stairway2HealthDashboardStatisticsModule { }
