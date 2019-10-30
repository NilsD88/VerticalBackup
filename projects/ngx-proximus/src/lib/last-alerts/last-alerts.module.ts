import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastAlertsComponent } from './last-alerts.component';
import { MatCardModule, MatTooltipModule, MatButtonModule } from '@angular/material';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LastAlertsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    MatButtonModule,
    ImgFallbackModule,
    TranslateModule,
    IconModule
  ],
  exports: [
    LastAlertsComponent
  ]
})
export class LastAlertsModule { }
