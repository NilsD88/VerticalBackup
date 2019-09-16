import { ThresholdTemplatesDetailModule } from './../../../../../projects/ngx-proximus/src/lib/threshold-templates-detail/threshold-templates-detail.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { AlertsService } from '../../../services/alerts.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Detail2Component} from './detail2.component';
import {RouterModule} from '@angular/router';
import {Detail2Routes} from './detail2.routing';
import {TranslateModule} from '@ngx-translate/core';
import {MatDividerModule, MatExpansionModule, MatTooltipModule} from '@angular/material';
import {HighchartsChartModule} from 'highcharts-angular';
import {LogsService} from '../../../services/logs.service';
import {ChartModule} from '../../../../../projects/ngx-proximus/src/lib/chart/chart.module';
import {RangeSliderModule} from '../../../../../projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {AggregatedValuesModule} from '../../../../../projects/ngx-proximus/src/lib/aggregated-values/aggregated-values.module';
import {MapAsset2Module} from '../../../../../projects/ngx-proximus/src/lib/map-asset2/map-asset2.module';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ImgFallbackModule} from 'ngx-img-fallback';
import { NewLocationService } from 'src/app/services/new-location.service';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { Detail2HeaderModule } from 'projects/ngx-proximus/src/lib/detail2-header/detail2-header.module';


@NgModule({
  declarations: [Detail2Component],
  imports: [
    CommonModule,
    RouterModule.forChild(Detail2Routes),
    MatProgressButtonsModule,
    TranslateModule,
    MatDividerModule,
    MatExpansionModule,
    HighchartsChartModule,
    ChartModule,
    AggregatedValuesModule,
    MapAsset2Module,
    IconModule,
    FlexLayoutModule,
    MatTooltipModule,
    ImgFallbackModule,
    Detail2HeaderModule,
    RangeSliderModule,
    ThresholdTemplatesDetailModule
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
