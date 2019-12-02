import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {PeopleCountingRetailRoutes} from './people-counting-retail.routing'





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(PeopleCountingRetailRoutes)
  ]
})
export class PeopleCountingRetailModule { }
