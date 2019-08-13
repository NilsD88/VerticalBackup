import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateRangeSelectionComponent} from './date-range-selection.component';
import {NgxMatDrpModule} from 'ngx-mat-daterange-picker';

@NgModule({
  declarations: [DateRangeSelectionComponent],
  imports: [
    CommonModule,
    NgxMatDrpModule
  ],
  exports: [
    DateRangeSelectionComponent
  ]
})
export class DateRangeSelectionModule {
}
