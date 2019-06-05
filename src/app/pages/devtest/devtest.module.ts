import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevtestComponent } from './devtest.component';
import {RouterModule} from '@angular/router';
import {DevtestRoutes} from './devtest.routing';
import {ChartModule} from '../../../../projects/ngx-proximus/src/lib/chart/chart.module';

@NgModule({
  declarations: [DevtestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DevtestRoutes),
    ChartModule
  ]
})
export class DevtestModule { }
