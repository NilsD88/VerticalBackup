import { CustomFieldsModule } from './../../../../../projects/ngx-proximus/src/lib/custom-fields/custom-fields.module';
import { AssetExplorerModule } from 'projects/ngx-proximus/src/lib/asset-explorer/asset-explorer.module';
import { AssetsCounterModule } from 'src/app/shared/people-counting/location/assets-counter/assets-counter.module';
import { CountByAssetModule } from 'src/app/shared/people-counting/location/charts/count-by-asset/count-by-asset.module';
import { CalendarViewModule } from './../../../shared/people-counting/location/charts/calendar-view/calendar-view.module';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PlaceComponent } from './place.component';
import { RouterModule } from '@angular/router';
import { PlaceRoutes } from './place.routing';
import { MonthViewModule } from 'src/app/shared/people-counting/location/charts/month-view/month-view.module';
import { DayViewModule } from 'src/app/shared/people-counting/location/charts/day-view/day-view.module';
import { SummaryModule } from 'src/app/shared/people-counting/location/summary/summary.module';

@NgModule({
  declarations: [PlaceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(PlaceRoutes),
    CalendarViewModule,
    MonthViewModule,
    CalendarViewModule,
    CountByAssetModule,
    AssetsCounterModule,
    MapModule,
    SummaryModule,
    AssetExplorerModule,
    DayViewModule,
    TranslateModule,
    CustomFieldsModule
  ],
  exports: [PlaceComponent]
})
export class PlaceModule {
}
