import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFieldsComponent } from './custom-fields.component';



@NgModule({
  declarations: [CustomFieldsComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [CustomFieldsComponent]
})
export class CustomFieldsModule { }
