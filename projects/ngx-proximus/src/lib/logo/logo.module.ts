import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo.component';

@NgModule({
  declarations: [LogoComponent],
  exports: [
    LogoComponent
  ],
  imports: [
    CommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LogoModule { }
