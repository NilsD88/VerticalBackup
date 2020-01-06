import { PieTotalChartComponent } from './pie-total-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [PieTotalChartComponent],
  imports: [
    CommonModule
  ],
  exports:[
    PieTotalChartComponent
  ]
})
export class PieTotalChartModule { }
