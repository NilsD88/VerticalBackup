import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataErrorComponent } from './data-error.component';



@NgModule({
  declarations: [DataErrorComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule
  ],
  exports: [DataErrorComponent]
})
export class DataErrorModule { }
