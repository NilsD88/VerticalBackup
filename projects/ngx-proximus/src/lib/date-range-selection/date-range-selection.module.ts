import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateRangeSelectionComponent} from './date-range-selection.component';
import {NgxMatDrpModule} from 'ngx-mat-daterange-picker';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [DateRangeSelectionComponent],
  imports: [
    CommonModule,
    NgxMatDrpModule,
    IconModule,
    MatButtonModule
  ],
  exports: [
    DateRangeSelectionComponent
  ]
})
export class DateRangeSelectionModule {
}
