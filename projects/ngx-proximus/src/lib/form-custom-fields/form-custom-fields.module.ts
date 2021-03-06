import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCustomFieldsComponent } from './form-custom-fields.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [FormCustomFieldsComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule
  ],
  exports: [FormCustomFieldsComponent]
})
export class FormCustomFieldsModule { }
