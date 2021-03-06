import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { MatButtonToggleModule, MatIconModule } from '@angular/material';
import { WalkingTrailsMapModule } from '../lib/map/map.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { CountPastWeekModule } from 'src/app/shared/people-counting/dashboard/charts/count-past-week/count-past-week.module';
import { TotalCountPastWeekModule } from 'src/app/shared/people-counting/dashboard/charts/total-count-past-week/total-count-past-week.module';
import { TotalCountPastYearModule } from 'src/app/shared/people-counting/dashboard/charts/total-count-past-year/total-count-past-year.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    TranslateModule,
    MatButtonToggleModule,
    MatIconModule,
    LocationExplorerModule,
    WalkingTrailsMapModule,
    CountPastWeekModule,
    TotalCountPastWeekModule,
    TotalCountPastYearModule,
    TranslateModule,
  ]
})
export class DashboardModule {
}
