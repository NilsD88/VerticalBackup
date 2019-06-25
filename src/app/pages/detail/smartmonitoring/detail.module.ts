import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailComponent} from './detail.component';
import {RouterModule} from '@angular/router';
import {DetailRoutes} from './detail.routing';
import {TranslateModule} from '@ngx-translate/core';
import {MatDividerModule, MatExpansionModule} from '@angular/material';
import {SharedAlertsService} from '../../alerts/shared-alerts.service';
import {HighchartsChartModule} from 'highcharts-angular';
import {LogsService} from '../../../services/logs.service';
import {LoaderModule} from '../../../../../projects/ngx-proximus/src/lib/loader/loader.module';
import {ChartModule} from '../../../../../projects/ngx-proximus/src/lib/chart/chart.module';
import {RangeSliderModule} from '../../../../../projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {AggregatedValuesModule} from '../../../../../projects/ngx-proximus/src/lib/aggregated-values/aggregated-values.module';
import {MapModule} from '../../../../../projects/ngx-proximus/src/lib/map/map.module';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DetailRoutes),
    TranslateModule,
    MatDividerModule,
    MatExpansionModule,
    HighchartsChartModule,
    LoaderModule,
    ChartModule,
    AggregatedValuesModule,
    MapModule,
    IconModule,
    FlexLayoutModule,
    RangeSliderModule
  ],
  providers: [SharedAlertsService, LogsService]
})
export class DetailModule {
}
