import { PieWeekChartComponent } from './pie-week-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [PieWeekChartComponent],
  imports: [
    CommonModule
  ],
  exports:[PieWeekChartComponent]
})
export class PieWeekChartModule { }
