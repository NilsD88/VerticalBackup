import { NoDataModule } from './../../../../../projects/ngx-proximus/src/lib/no-data/no-data.module';
import { ThresholdTemplatesDetailModule } from '../../../../../projects/ngx-proximus/src/lib/threshold-templates-detail/threshold-templates-detail.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { AlertsService } from 'src/app/services/alerts.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Detail2Component} from './detail2.component';
import {RouterModule} from '@angular/router';
import {Detail2Routes} from './detail2.routing';
import {TranslateModule} from '@ngx-translate/core';
import { MatDividerModule, MatExpansionModule, MatTooltipModule, MatCardModule } from '@angular/material';
import {HighchartsChartModule} from 'highcharts-angular';
import {LogsService} from 'src/app/services/logs.service';
import {ChartModule} from '../lib/chart/chart.module';
import {RangeSliderModule} from '../../../../../projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {AggregatedValuesModule} from '../../../../../projects/ngx-proximus/src/lib/aggregated-values/aggregated-values.module';
import {MapAsset2Module} from '../../../../../projects/ngx-proximus/src/lib/map-asset2/map-asset2.module';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ImgFallbackModule} from 'ngx-img-fallback';
import { NewLocationService } from 'src/app/services/new-location.service';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { DetailHeaderModule } from 'src/app/pages/smart-monitoring/lib/detail-header/detail-header.module';
import { LinkedThingsModule } from 'projects/ngx-proximus/src/lib/linked-things/linked-things.module';


@NgModule({
  declarations: [Detail2Component],
  imports: [
    CommonModule,
    RouterModule.forChild(Detail2Routes),
    TranslateModule,
    MatProgressButtonsModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    HighchartsChartModule,
    ChartModule,
    AggregatedValuesModule,
    MapAsset2Module,
    IconModule,
    FlexLayoutModule,
    ImgFallbackModule,
    DetailHeaderModule,
    RangeSliderModule,
    ThresholdTemplatesDetailModule,
    LinkedThingsModule,
    NoDataModule,
  ],
  providers: [
    AlertsService,
    LogsService,
    NewLocationService,
    NewAssetService
  ]
})
export class Detail2Module {
}
