import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalCountPastWeekComponent } from './total-count-past-week.component';



@NgModule({
  declarations: [TotalCountPastWeekComponent],
  imports: [
    CommonModule,
    LoaderModule
  ],
  exports: [TotalCountPastWeekComponent]
})
export class TotalCountPastWeekModule { }
