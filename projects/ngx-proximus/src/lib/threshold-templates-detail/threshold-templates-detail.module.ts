import { ThresholdTemplatesDetailItemModule } from './../threshold-templates-detail-item/threshold-templates-detail-item.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThresholdTemplatesDetailComponent } from './threshold-templates-detail.component';

@NgModule({
  declarations: [ThresholdTemplatesDetailComponent],
  imports: [
    CommonModule,
    ThresholdTemplatesDetailItemModule
  ],
  exports: [ThresholdTemplatesDetailComponent]
})
export class ThresholdTemplatesDetailModule { }
