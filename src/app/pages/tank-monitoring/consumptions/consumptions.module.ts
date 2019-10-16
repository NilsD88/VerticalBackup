import { DetailHeaderModule } from './../lib/detail-header/detail-header.module';
import { LogsService } from './../../../services/logs.service';
import { ChartModule } from '../lib/chart/chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumptionsComponent } from './consumptions.component';
import { ConsumptionsRoutes } from './consumptions.routing';
import { RouterModule } from '@angular/router';
import { AssetService } from 'src/app/services/asset.service';
import { MapAsset2Module } from 'projects/ngx-proximus/src/lib/map-asset2/map-asset2.module';
import { ThresholdTemplatesDetailModule } from 'projects/ngx-proximus/src/lib/threshold-templates-detail/threshold-templates-detail.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { LinkedThingsModule } from 'projects/ngx-proximus/src/lib/linked-things/linked-things.module';

@NgModule({
  declarations: [ConsumptionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ConsumptionsRoutes),
    TranslateModule,
    MatProgressButtonsModule,
    DetailHeaderModule,
    MapAsset2Module,
    ThresholdTemplatesDetailModule,
    LinkedThingsModule,
    ChartModule
  ],
  providers: [
    AssetService,
    LogsService
  ]
})
export class ConsumptionsModule { }
