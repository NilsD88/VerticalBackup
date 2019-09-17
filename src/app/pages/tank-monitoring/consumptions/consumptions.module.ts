import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumptionsComponent } from './consumptions.component';
import { ConsumptionsRoutes } from './consumptions.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ConsumptionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ConsumptionsRoutes),
  ]
})
export class ConsumptionsModule { }
