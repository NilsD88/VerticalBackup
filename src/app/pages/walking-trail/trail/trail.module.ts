import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { SummaryStatisticsModule } from './summary-statistics/summary-statistics.module';
import { TrailMapModule } from './trail-map/trail-map.module';
import { TrailsBenchmarkModule } from './charts/trails-benchmark/trails-benchmark.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailComponent } from './trail.component';
import { RouterModule } from '@angular/router';
import { TrailRoutes } from './trail.routing';
import {SlideshowModule} from 'ng-simple-slideshow';
import { MonthViewModule } from 'src/app/shared/people-counting/detail/charts/month-view/month-view.module';
import { CountByAssetModule } from 'src/app/shared/people-counting/detail/charts/count-by-asset/count-by-asset.module';
import { AssetsCounterModule } from 'src/app/shared/people-counting/detail/assets-counter/assets-counter.module';



@NgModule({
  declarations: [TrailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TrailRoutes),
    MonthViewModule,
    TrailsBenchmarkModule,
    CountByAssetModule,
    AssetsCounterModule,
    TrailMapModule,
    SummaryStatisticsModule,
    SlideshowModule,
    MapModule
  ],
  exports: [TrailComponent]
})
export class TrailModule { }
