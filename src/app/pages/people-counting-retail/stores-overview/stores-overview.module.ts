
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresOverviewComponent } from './stores-overview.component';
import { RouterModule } from '@angular/router';
import {StoresOverviewRoutes} from './stores-overview.routing' 
import {StackedChartModule} from './chart/stacked-chart/stacked-chart.module'




@NgModule({
  declarations: [StoresOverviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StoresOverviewRoutes),
    LoaderModule,
    StackedChartModule
    
  ]
})
export class StoresOverviewModule { }
