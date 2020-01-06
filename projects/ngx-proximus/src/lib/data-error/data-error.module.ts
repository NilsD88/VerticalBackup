import { MatButtonModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataErrorComponent } from './data-error.component';



@NgModule({
  declarations: [DataErrorComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [DataErrorComponent]
})
export class DataErrorModule { }
