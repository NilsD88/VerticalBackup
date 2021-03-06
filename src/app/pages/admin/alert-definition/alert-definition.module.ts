import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertDefinitionComponent} from './alert-definition.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlertDefinitionRoutes} from './alert-definitions.routing';
import {TranslateModule} from '@ngx-translate/core';
import {LoaderModule} from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AlertDefinitionRoutes),
    FormsModule,
    TranslateModule,
    LoaderModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatInputModule,
    CKEditorModule
  ],
  declarations: [AlertDefinitionComponent],
  exports: [AlertDefinitionComponent]
})
export class AlertDefinitionModule {
}
