import { ChartControlsModule } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfAttentionChartComponent } from './point-of-attention-chart.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';

@NgModule({
  declarations: [PointOfAttentionChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
    ChartControlsModule
  ],
  exports: [PointOfAttentionChartComponent]
})
export class PointOfAttentionChartModule { }
