import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedValuesComponent } from './aggregated-values.component';
import {IconModule} from '../icon/icon.module';

@NgModule({
  declarations: [AggregatedValuesComponent],
  imports: [
    CommonModule,
    IconModule
  ],
  exports:[
    AggregatedValuesComponent
  ]
})
export class AggregatedValuesModule { }
