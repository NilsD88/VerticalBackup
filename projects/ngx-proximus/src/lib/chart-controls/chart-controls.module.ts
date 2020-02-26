import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartControlsComponent } from './chart-controls.component';
import { MatButtonToggleModule, MatButtonModule, MatMenuModule, MatIconModule } from '@angular/material';
import { DateRangeSelectionModule } from '../date-range-selection/date-range-selection.module';

@NgModule({
  declarations: [ChartControlsComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    DateRangeSelectionModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule
  ],
  exports: [ChartControlsComponent],
})
export class ChartControlsModule {}
