import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperNextComponent } from './stepper-next.component';
import { IconModule } from '../icon/icon.module';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [StepperNextComponent],
  imports: [
    CommonModule,
    IconModule,
    ButtonModule,
    MatButtonModule,
    TranslateModule,
  ],
  exports: [
    StepperNextComponent
  ]
})
export class StepperNextModule { }
