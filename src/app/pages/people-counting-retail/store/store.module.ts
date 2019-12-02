import { AssetsCounterModule } from 'src/app/shared/people-counting/detail/assets-counter/assets-counter.module';
import { CountByAssetModule } from 'src/app/shared/people-counting/detail/charts/count-by-asset/count-by-asset.module';
import { CalendarViewModule } from './../../../shared/people-counting/detail/charts/calendar-view/calendar-view.module';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { RouterModule } from '@angular/router';
import { StoreRoutes } from './store.routing';
import { StackedChartModule } from './chart/stacked-chart/stacked-chart.module';
import { MonthViewModule } from 'src/app/shared/people-counting/detail/charts/month-view/month-view.module';


@NgModule({
  declarations: [StoreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StoreRoutes),
    CalendarViewModule,
    StackedChartModule,
    MonthViewModule,
    CalendarViewModule,
    CountByAssetModule,
    AssetsCounterModule,
    MapModule
  ],
  exports: [StoreComponent]
})
export class StoreModule { }
