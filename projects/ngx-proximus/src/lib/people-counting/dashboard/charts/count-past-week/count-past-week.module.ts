import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountPastWeekComponent } from './count-past-week.component';



@NgModule({
  declarations: [CountPastWeekComponent],
  imports: [
    CommonModule,
    LoaderModule
  ],
  exports: [CountPastWeekComponent]
})
export class CountPastWeekModule { }
