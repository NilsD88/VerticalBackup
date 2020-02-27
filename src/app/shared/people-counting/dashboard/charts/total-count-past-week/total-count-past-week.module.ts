import { TranslateModule } from '@ngx-translate/core';
import { DataErrorModule } from './../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalCountPastWeekComponent } from './total-count-past-week.component';



@NgModule({
  declarations: [TotalCountPastWeekComponent],
  imports: [
    CommonModule,
    LoaderModule,
    DataErrorModule,
    TranslateModule
  ],
  exports: [TotalCountPastWeekComponent]
})
export class TotalCountPastWeekModule { }
