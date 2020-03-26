import {DataErrorModule} from './../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';
import {DialogModule} from './../../../../../../../projects/ngx-proximus/src/lib/dialog/dialog.module';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {LoaderModule} from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MonthViewComponent} from './month-view.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [MonthViewComponent],
  imports: [
    CommonModule,
    LoaderModule,
    MatButtonModule,
    MatDialogModule,
    IconModule,
    DialogModule,
    DataErrorModule,
    TranslateModule
  ],
  exports: [MonthViewComponent]
})
export class MonthViewModule {
}
