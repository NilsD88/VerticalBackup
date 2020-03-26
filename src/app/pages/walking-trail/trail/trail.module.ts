import {TrailImagesModule} from './trail-images/trail-images.module';
import {MapModule} from 'projects/ngx-proximus/src/lib/map/map.module';
import {SummaryStatisticsModule} from './summary-statistics/summary-statistics.module';
import {TrailMapModule} from './trail-map/trail-map.module';
import {TrailsBenchmarkModule} from './charts/trails-benchmark/trails-benchmark.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrailComponent} from './trail.component';
import {RouterModule} from '@angular/router';
import {TrailRoutes} from './trail.routing';
import {MonthViewModule} from 'src/app/shared/people-counting/location/charts/month-view/month-view.module';
import {CountByAssetModule} from 'src/app/shared/people-counting/location/charts/count-by-asset/count-by-asset.module';
import {AssetsCounterModule} from 'src/app/shared/people-counting/location/assets-counter/assets-counter.module';
import {AssetExplorerModule} from 'projects/ngx-proximus/src/lib/asset-explorer/asset-explorer.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [TrailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TrailRoutes),
    TrailImagesModule,
    MonthViewModule,
    TrailsBenchmarkModule,
    CountByAssetModule,
    AssetsCounterModule,
    TrailMapModule,
    SummaryStatisticsModule,
    AssetExplorerModule,
    MapModule,
    TranslateModule
  ],
  exports: [TrailComponent]
})
export class TrailModule {
}
