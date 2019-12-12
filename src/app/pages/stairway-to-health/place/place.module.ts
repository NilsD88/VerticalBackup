import { AssetsCounterModule } from 'src/app/shared/people-counting/location/assets-counter/assets-counter.module';
import { CountByAssetModule } from 'src/app/shared/people-counting/location/charts/count-by-asset/count-by-asset.module';
import { CalendarViewModule } from './../../../shared/people-counting/location/charts/calendar-view/calendar-view.module';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceComponent } from './place.component';
import { RouterModule } from '@angular/router';
import { PlaceRoutes } from './place.routing';
import { StackedChartModule } from './chart/stacked-chart/stacked-chart.module';
import { MonthViewModule } from 'src/app/shared/people-counting/location/charts/month-view/month-view.module';


@NgModule({
  declarations: [PlaceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PlaceRoutes),
    CalendarViewModule,
    StackedChartModule,
    MonthViewModule,
    CalendarViewModule,
    CountByAssetModule,
    AssetsCounterModule,
    MapModule
  ],
  exports: [PlaceComponent]
})
export class PlaceModule { }
