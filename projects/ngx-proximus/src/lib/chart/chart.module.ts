import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionModule } from '../date-range-selection/date-range-selection.module';
import { MatButtonToggleModule, MatButtonModule } from '@angular/material';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    FormsModule,
    DateRangeSelectionModule,
    MatButtonToggleModule,
    MatButtonModule,
    LoaderModule,
  ],
  exports: [ChartComponent]
})
export class ChartModule { }
