import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TotalCountPastYearComponent } from './total-count-past-year.component';



@NgModule({
  declarations: [TotalCountPastYearComponent],
  imports: [
    CommonModule,
    LoaderModule
  ],
  exports: [TotalCountPastYearComponent],
  providers: [
    DatePipe
  ]
})
export class TotalCountPastYearModule { }
