import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { AlertsService } from '../../../services/alerts.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailComponent} from './detail.component';
import {RouterModule} from '@angular/router';
import {DetailRoutes} from './detail.routing';
import {TranslateModule} from '@ngx-translate/core';
import {MatDividerModule, MatExpansionModule, MatTooltipModule} from '@angular/material';
import {HighchartsChartModule} from 'highcharts-angular';
import {LogsService} from '../../../services/logs.service';
import {ChartModule} from '../../../../../projects/ngx-proximus/src/lib/chart/chart.module';
import {RangeSliderModule} from '../../../../../projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {AggregatedValuesModule} from '../../../../../projects/ngx-proximus/src/lib/aggregated-values/aggregated-values.module';
import {MapAssetModule} from '../../../../../projects/ngx-proximus/src/lib/map-asset/map-asset.module';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ImgFallbackModule} from 'ngx-img-fallback';
import {DetailHeaderModule} from '../../../../../projects/ngx-proximus/src/lib/detail-header/detail-header.module';


@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DetailRoutes),
    MatProgressButtonsModule,
    TranslateModule,
    MatDividerModule,
    MatExpansionModule,
    HighchartsChartModule,
    ChartModule,
    AggregatedValuesModule,
    MapAssetModule,
    IconModule,
    FlexLayoutModule,
    MatTooltipModule,
    ImgFallbackModule,
    DetailHeaderModule,
    RangeSliderModule
  ],
  providers: [AlertsService, LogsService]
})
export class DetailModule {
}
