import { DashboardRoutes } from './dashboard.routing';
import { RangeSliderModule } from './../../../../../projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {TranslateModule} from '@ngx-translate/core';
import {PieChartModule} from '../../../../../projects/ngx-proximus/src/lib/pie-chart/pie-chart.module';
import { MatTableModule, MatSortModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatPaginatorModule } from '@angular/material';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    TranslateModule,
    PieChartModule,
    MapModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    RangeSliderModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule
  ],
  providers: [
    NewAssetService,
  ]
})
export class DashboardModule { }
