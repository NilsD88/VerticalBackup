import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {IconModule} from '../icon/icon.module';
import { FormKeyvalueComponent } from './form-keyvalue.component';

@NgModule({
  declarations: [FormKeyvalueComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatStepperModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,
    MatFormFieldModule,
    IconModule,
  ],
  exports: [FormKeyvalueComponent]
})
export class FormKeyvalueModule { }
