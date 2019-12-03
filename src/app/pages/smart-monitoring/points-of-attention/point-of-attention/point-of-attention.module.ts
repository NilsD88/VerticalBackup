import { PointOfAttentionRoutes } from './point-of-attention.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfAttentionComponent } from './point-of-attention.component';
import {PointOfAttentionChartModule} from 'src/app/pages/smart-monitoring/lib/point-of-attention-chart/point-of-attention-chart.module';

@NgModule({
  declarations: [PointOfAttentionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PointOfAttentionRoutes),
    PointOfAttentionChartModule,
  ]
})
export class PointOfAttentionModule { }
