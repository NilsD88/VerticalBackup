import { LastAlertsModule } from 'projects/ngx-proximus/src/lib/last-alerts/last-alerts.module';
import { NoDataModule } from 'projects/ngx-proximus/src/lib/no-data/no-data.module';
import { ThresholdTemplatesDetailModule } from 'projects/ngx-proximus/src/lib/threshold-templates-detail/threshold-templates-detail.module';
import { AlertsService } from 'src/app/services/alerts.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailComponent} from './detail.component';
import {RouterModule} from '@angular/router';
import {DetailRoutes} from './detail.routing';
import {TranslateModule} from '@ngx-translate/core';
import { MatDividerModule, MatExpansionModule, MatTooltipModule, MatCardModule } from '@angular/material';
import {HighchartsChartModule} from 'highcharts-angular';
import {LogsService} from 'src/app/services/logs.service';
import {ChartModule} from '../lib/chart/chart.module';
import {RangeSliderModule} from 'projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {AggregatedValuesModule} from 'projects/ngx-proximus/src/lib/aggregated-values/aggregated-values.module';
import {MapAssetModule} from 'projects/ngx-proximus/src/lib/map-asset/map-asset.module';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NewLocationService } from 'src/app/services/new-location.service';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { DetailHeaderModule } from 'src/app/pages/smart-monitoring/lib/detail-header/detail-header.module';
import { LinkedThingsModule } from 'projects/ngx-proximus/src/lib/linked-things/linked-things.module';


@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DetailRoutes),
    TranslateModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    HighchartsChartModule,
    ChartModule,
    AggregatedValuesModule,
    MapAssetModule,
    IconModule,
    FlexLayoutModule,
    DetailHeaderModule,
    RangeSliderModule,
    ThresholdTemplatesDetailModule,
    LinkedThingsModule,
    LastAlertsModule,
    NoDataModule,
  ],
  providers: [
    AlertsService,
    LogsService,
    NewLocationService,
    NewAssetService
  ]
})
export class DetailModule {
}
