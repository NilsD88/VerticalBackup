import { DataErrorModule } from './../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';
import { MatButtonToggleModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayViewComponent } from './day-view.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';



@NgModule({
  declarations: [DayViewComponent],
  imports: [
    CommonModule,
    LoaderModule,
    MatButtonToggleModule,
    DataErrorModule
  ],
  exports: [DayViewComponent]
})
export class DayViewModule { }
