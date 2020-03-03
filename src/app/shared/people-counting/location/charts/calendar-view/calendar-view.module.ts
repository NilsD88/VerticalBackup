import { DataErrorModule } from './../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';
import { DialogModule } from './../../../../../../../projects/ngx-proximus/src/lib/dialog/dialog.module';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CalendarViewComponent } from './calendar-view.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { MatButtonModule, MatDialogModule } from '@angular/material';



@NgModule({
  declarations: [CalendarViewComponent],
  imports: [
    CommonModule,
    LoaderModule,
    MatButtonModule,
    MatDialogModule,
    DialogModule,
    IconModule,
    DataErrorModule
  ],
  providers: [
    DecimalPipe
  ],
  exports: [CalendarViewComponent]
})
export class CalendarViewModule { }
