import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';



@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [SummaryComponent]
})
export class SummaryModule { }
