import { LoaderModule } from './../../../../../../projects/ngx-proximus/src/lib/loader/loader.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';



@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LoaderModule
  ],
  exports: [SummaryComponent]
})
export class SummaryModule { }
