import { DialogModule } from './../../../../../projects/ngx-proximus/src/lib/dialog/dialog.module';
import { LastAlertsModule } from 'projects/ngx-proximus/src/lib/last-alerts/last-alerts.module';
import { NoDataModule } from 'projects/ngx-proximus/src/lib/no-data/no-data.module';
import { DetailHeaderModule } from './../lib/detail-header/detail-header.module';
import { ChartModule } from '../lib/chart/chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumptionsComponent } from './consumptions.component';
import { ConsumptionsRoutes } from './consumptions.routing';
import { RouterModule } from '@angular/router';
import { MapAssetModule } from 'projects/ngx-proximus/src/lib/map-asset/map-asset.module';
import { ThresholdTemplatesDetailModule } from 'projects/ngx-proximus/src/lib/threshold-templates-detail/threshold-templates-detail.module';
import { TranslateModule } from '@ngx-translate/core';
import { LinkedThingsModule } from 'projects/ngx-proximus/src/lib/linked-things/linked-things.module';

@NgModule({
  declarations: [ConsumptionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ConsumptionsRoutes),
    TranslateModule,
    DetailHeaderModule,
    MapAssetModule,
    ThresholdTemplatesDetailModule,
    LinkedThingsModule,
    ChartModule,
    NoDataModule,
    LastAlertsModule,
    DialogModule
  ]
})
export class ConsumptionsModule { }
