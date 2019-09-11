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
    ButtonModule
  ],
  exports: [
    StepperNextComponent
  ]
})
export class StepperNextModule { }
