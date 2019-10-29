import { TankMonitoringMapModule } from './../lib/map/map.module';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { DashboardRoutes } from './dashboard.routing';
import { RangeSliderModule } from 'projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {TranslateModule} from '@ngx-translate/core';
import {PieChartModule} from 'projects/ngx-proximus/src/lib/pie-chart/pie-chart.module';
import { MatTableModule, MatSortModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatPaginatorModule, MatButtonModule } from '@angular/material';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    TranslateModule,
    PieChartModule,
    TankMonitoringMapModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    RangeSliderModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    IconModule,
    MatButtonModule
  ],
  providers: [
    NewAssetService,
  ]
})
export class DashboardModule { }
