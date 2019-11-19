import { PieChartModule } from './../../../../../projects/ngx-proximus/src/lib/pie-chart/pie-chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import {DashboardRoutes} from './dashboard.routing';
import {MapModule} from '../../../../../projects/ngx-proximus/src/lib/map/map.module';





@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MapModule,
    PieChartModule
  ]
})
export class DashboardModule { }
