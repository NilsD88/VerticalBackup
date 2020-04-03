import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardRoutes} from './dashboard.routing';
import { MatButtonToggleModule, MatIconModule } from '@angular/material';
import { CountPastWeekModule } from 'src/app/shared/people-counting/dashboard/charts/count-past-week/count-past-week.module';
import { TotalCountPastWeekModule } from 'src/app/shared/people-counting/dashboard/charts/total-count-past-week/total-count-past-week.module';
import { TotalCountPastYearModule } from 'src/app/shared/people-counting/dashboard/charts/total-count-past-year/total-count-past-year.module';
import { PeopleCountingRetailMapModule } from '../lib/map/map.module';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MatButtonToggleModule,
    TranslateModule,
    MatIconModule,
    LocationExplorerModule,
    PeopleCountingRetailMapModule,
    CountPastWeekModule,
    TotalCountPastWeekModule,
    TotalCountPastYearModule,
  ]
})
export class DashboardModule { }
