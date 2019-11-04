import { DialogModule } from 'projects/ngx-proximus/src/lib/dialog/dialog.module';
import { ListThresholdTemplatesModule } from 'projects/ngx-proximus/src/lib/list-threshold-templates/list-threshold-templates.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderModule} from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule,
} from '@angular/material';
import {RangeSliderModule} from 'projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { ButtonModule } from 'projects/ngx-proximus/src/lib/button/button.module';
import { ManageThresholdTemplatesDialogComponent } from './manageThresholdTemplatesDialog.component';
import { AddThresholdDialogComponent } from './addThresholdDialog.component';

@NgModule({
  declarations: [
    ManageThresholdTemplatesDialogComponent,
    AddThresholdDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IconModule,
    ButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    ListThresholdTemplatesModule,
    LoaderModule,
    RangeSliderModule,
    DialogModule
  ],
  exports: [
    ManageThresholdTemplatesDialogComponent
  ],
  entryComponents: [ManageThresholdTemplatesDialogComponent, AddThresholdDialogComponent],
})
export class ManageThresholdTemplatesDialogModule {
}
