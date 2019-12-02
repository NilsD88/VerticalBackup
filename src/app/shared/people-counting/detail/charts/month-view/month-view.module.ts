import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthViewComponent } from './month-view.component';
import { MatButtonModule } from '@angular/material';



@NgModule({
  declarations: [MonthViewComponent],
  imports: [
    CommonModule,
    LoaderModule,
    MatButtonModule,
    IconModule
  ],
  exports: [MonthViewComponent]
})
export class MonthViewModule {}
