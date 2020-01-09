import { DataErrorModule } from './../../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { PieChartComponent } from './pie-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [PieChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
    DataErrorModule
  ],
  exports: [PieChartComponent]
})
export class PieChartModule { }
