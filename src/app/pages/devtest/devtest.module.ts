import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevtestComponent } from './devtest.component';
import {RouterModule} from '@angular/router';
import {DevtestRoutes} from './devtest.routing';
import {IconModule} from '../../../../projects/ngx-proximus/src/lib/icon/icon.module';

@NgModule({
  declarations: [DevtestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DevtestRoutes),
    IconModule
  ]
})
export class DevtestModule { }
