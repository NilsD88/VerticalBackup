import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastAlertsComponent } from './last-alerts.component';

@NgModule({
  declarations: [LastAlertsComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LastAlertsComponent
  ]
})
export class LastAlertsModule { }
