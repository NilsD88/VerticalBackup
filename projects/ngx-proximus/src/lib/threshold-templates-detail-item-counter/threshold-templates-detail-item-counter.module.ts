import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThresholdTemplatesDetailItemCounterComponent } from './threshold-templates-detail-item-counter.component';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [ThresholdTemplatesDetailItemCounterComponent],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    ThresholdTemplatesDetailItemCounterComponent
  ]
})
export class ThresholdTemplatesDetailItemCounterModule { }
