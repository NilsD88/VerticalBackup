import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThresholdTemplatesDetailItemComponent } from './threshold-templates-detail-item.component';
import { ThresholdTemplatesDetailItemNumberModule } from '../threshold-templates-detail-item-number/threshold-templates-detail-item-number.module';
import { ThresholdTemplatesDetailItemCounterModule } from '../threshold-templates-detail-item-counter/threshold-templates-detail-item-counter.module';
import { ThresholdTemplatesDetailItemBooleanModule } from '../threshold-templates-detail-item-boolean/threshold-templates-detail-item-boolean.module';

@NgModule({
  declarations: [ThresholdTemplatesDetailItemComponent],
  imports: [
    CommonModule,
    ThresholdTemplatesDetailItemNumberModule,
    ThresholdTemplatesDetailItemCounterModule,
    ThresholdTemplatesDetailItemBooleanModule
  ],
  exports: [
    ThresholdTemplatesDetailItemComponent
  ]
})
export class ThresholdTemplatesDetailItemModule { }
