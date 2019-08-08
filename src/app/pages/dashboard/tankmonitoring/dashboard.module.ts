import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {RouterModule} from '@angular/router';
import {DashboardRoutes} from './dashboard.routing';
import {TranslateModule} from '@ngx-translate/core';
import {PieChartModule} from '../../../../../projects/ngx-proximus/src/lib/pie-chart/pie-chart.module';
import {MapAssetModule} from '../../../../../projects/ngx-proximus/src/lib/map-asset/map-asset.module';
import { MatTableModule, MatSortModule } from '@angular/material';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    TranslateModule,
    PieChartModule,
    MapAssetModule,
    MatTableModule,
    MatSortModule,
  ]
})
export class DashboardModule { }
