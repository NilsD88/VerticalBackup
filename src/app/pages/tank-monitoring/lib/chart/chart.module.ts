import { ChartControlsModule } from '../../../../../../projects/ngx-proximus/src/lib/chart-controls/chart-controls.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { LoaderModule } from '../../../../../../projects/ngx-proximus/src/lib/loader/loader.module';

@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    LoaderModule,
    ChartControlsModule
  ],
  exports: [ChartComponent]
})
export class ChartModule { }
