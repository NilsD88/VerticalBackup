import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThresholdTemplatesDetailItemBooleanComponent } from './threshold-templates-detail-item-boolean.component';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [ThresholdTemplatesDetailItemBooleanComponent],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    ThresholdTemplatesDetailItemBooleanComponent
  ]
})
export class ThresholdTemplatesDetailItemBooleanModule { }
