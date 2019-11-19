import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresOverviewComponent } from './stores-overview.component';
import { RouterModule } from '@angular/router';
import {StoresOverviewRoutes} from './stores-overview.routing' 



@NgModule({
  declarations: [StoresOverviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StoresOverviewRoutes)
    
  ]
})
export class StoresOverviewModule { }
