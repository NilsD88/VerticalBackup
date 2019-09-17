import { ChartControlsModule } from './../chart-controls/chart-controls.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
    ChartControlsModule
  ],
  exports: [ChartComponent]
})
export class ChartModule { }
