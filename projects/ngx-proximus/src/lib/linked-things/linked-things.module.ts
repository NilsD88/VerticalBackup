import { MatCardModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedThingsComponent } from './linked-things.component';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LinkedThingsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    ImgFallbackModule,
    TranslateModule
  ],
  exports: [
    LinkedThingsComponent
  ]
})
export class LinkedThingsModule { }
