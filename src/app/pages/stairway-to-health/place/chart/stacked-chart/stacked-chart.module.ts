import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedChartComponent } from './stacked-chart.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';


@NgModule({
  declarations: [StackedChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
  ],
  exports: [StackedChartComponent],
})
export class StackedChartModule { }
