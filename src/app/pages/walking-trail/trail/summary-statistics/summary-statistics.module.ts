import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryStatisticsComponent } from './summary-statistics.component';
import { MatTableModule, MatSortModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';



@NgModule({
  declarations: [SummaryStatisticsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCardModule,
    TranslateModule
  ],
  exports: [SummaryStatisticsComponent]
})
export class SummaryStatisticsModule { }
