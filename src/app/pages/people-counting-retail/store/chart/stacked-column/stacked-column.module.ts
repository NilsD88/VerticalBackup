import { MatButtonToggleModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedColumnComponent } from './stacked-column.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';



@NgModule({
  declarations: [StackedColumnComponent],
  imports: [
    CommonModule,
    LoaderModule,
    MatButtonToggleModule
  ],
  exports: [StackedColumnComponent]
})
export class StackedColumnModule { }
