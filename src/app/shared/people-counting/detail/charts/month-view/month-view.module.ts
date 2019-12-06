import { DialogModule } from './../../../../../../../projects/ngx-proximus/src/lib/dialog/dialog.module';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthViewComponent } from './month-view.component';
import { MatButtonModule, MatDialogModule } from '@angular/material';



@NgModule({
  declarations: [MonthViewComponent],
  imports: [
    CommonModule,
    LoaderModule,
    MatButtonModule,
    MatDialogModule,
    IconModule,
    DialogModule
  ],
  exports: [MonthViewComponent]
})
export class MonthViewModule {}
