import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthViewComponent } from './month-view.component';



@NgModule({
  declarations: [MonthViewComponent],
  imports: [
    CommonModule,
    LoaderModule
  ],
  exports: [MonthViewComponent]
})
export class MonthViewModule {}
