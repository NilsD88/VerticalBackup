import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThresholdTemplatesDetailItemNumberComponent } from './threshold-templates-detail-item-number.component';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [ThresholdTemplatesDetailItemNumberComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule
  ],
  exports: [ThresholdTemplatesDetailItemNumberComponent]
})
export class ThresholdTemplatesDetailItemNumberModule { }
