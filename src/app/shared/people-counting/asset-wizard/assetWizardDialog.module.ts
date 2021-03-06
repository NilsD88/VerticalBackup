import { FormCustomFieldsModule } from 'projects/ngx-proximus/src/lib/form-custom-fields/form-custom-fields.module';
import { ListThresholdTemplatesModule } from 'projects/ngx-proximus/src/lib/list-threshold-templates/list-threshold-templates.module';
import { ListThingsModule } from 'projects/ngx-proximus/src/lib/list-things/list-things.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule, MatListModule, MatDialogModule } from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { FormGeolocationModule } from 'projects/ngx-proximus/src/lib/form-geolocation/form-geolocation.module';
import { EditableImageModule } from 'projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';
import { TranslateModule } from '@ngx-translate/core';
import { PopupConfirmationModule } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.module';
import { PeopleCountingAssetWizardDialogComponent } from './assetWizardDialog.component';

@NgModule({
  declarations: [
    PeopleCountingAssetWizardDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    IconModule,
    FormGeolocationModule,
    EditableImageModule,
    LocationExplorerModule,
    StepperNextModule,
    TranslateModule,
    ListThingsModule,
    ListThresholdTemplatesModule,
    MatDialogModule,
    FormCustomFieldsModule,
    PopupConfirmationModule,
    TranslateModule
  ],
  exports: [PeopleCountingAssetWizardDialogComponent]
})
export class PeopleCountingAssetWizardDialogModule { }
