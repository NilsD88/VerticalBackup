import { LogsService } from './../../../services/logs.service';
import { ChartModule } from '../lib/chart/chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumptionsComponent } from './consumptions.component';
import { ConsumptionsRoutes } from './consumptions.routing';
import { RouterModule } from '@angular/router';
import { AssetService } from 'src/app/services/asset.service';

@NgModule({
  declarations: [ConsumptionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ConsumptionsRoutes),
    ChartModule
  ],
  providers: [
    AssetService,
    LogsService
  ]
})
export class ConsumptionsModule { }
