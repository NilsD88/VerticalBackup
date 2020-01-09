import { DataErrorModule } from './../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalCountChartComponent } from './total-count-chart.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { ChartControlsModule } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.module';

@NgModule({
  declarations: [TotalCountChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
    ChartControlsModule,
    DataErrorModule
  ],
  exports: [TotalCountChartComponent]
})
export class StairwayToHealthDashboardTotalCountModule { }
