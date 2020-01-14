import { DataErrorModule } from './../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TotalCountPastYearComponent } from './total-count-past-year.component';



@NgModule({
  declarations: [TotalCountPastYearComponent],
  imports: [
    CommonModule,
    LoaderModule,
    DataErrorModule
  ],
  exports: [TotalCountPastYearComponent],
  providers: [
    DatePipe
  ]
})
export class TotalCountPastYearModule { }
