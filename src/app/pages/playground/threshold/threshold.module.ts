import { MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThresholdComponent } from './threshold.component';
import { RouterModule } from '@angular/router';
import { ThresholdRoutes } from './threshold.routing';

@NgModule({
  declarations: [ThresholdComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ThresholdRoutes),
    MatTooltipModule
  ],
})
export class ThresholdModule { }
