import { PieDayChartComponent } from './pie-day-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [PieDayChartComponent],
  imports: [
    CommonModule
  ],
  exports:[PieDayChartComponent]
})
export class PieDayChartModule { }



