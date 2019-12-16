import { ChartControlsModule } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleCountingAssetChartComponent } from './chart.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';

@NgModule({
  declarations: [PeopleCountingAssetChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
    ChartControlsModule
  ],
  exports: [PeopleCountingAssetChartComponent]
})
export class PeopleCountingAssetChartModule { }
