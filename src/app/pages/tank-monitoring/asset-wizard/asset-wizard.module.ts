import { FormCustomFieldsModule } from 'projects/ngx-proximus/src/lib/form-custom-fields/form-custom-fields.module';
import { LocationWizardDialogComponent } from 'src/app/pages/admin/manage-locations/location-wizard/locationWizardDialog.component';
import { LocationWizardDialogModule } from 'src/app/pages/admin/manage-locations/location-wizard/locationWizardDialog.module';
import { ListThresholdTemplatesModule } from 'projects/ngx-proximus/src/lib/list-threshold-templates/list-threshold-templates.module';
import { ListThingsModule } from 'projects/ngx-proximus/src/lib/list-things/list-things.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TankMonitoringAssetWizardComponent } from './asset-wizard.component';
import {RouterModule} from '@angular/router';
import {TankMonitoringAssetWizardRoutes} from './asset-wizard.routing';
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
import { ManageThresholdTemplatesDialogModule } from '../../admin/manage-threshold-templates/manageThresholdTemplatesDialog.module';
import { ManageThresholdTemplatesDialogComponent } from '../../admin/manage-threshold-templates/manageThresholdTemplatesDialog.component';

@NgModule({
  declarations: [
    TankMonitoringAssetWizardComponent,
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
    PopupConfirmationModule,
    LocationWizardDialogModule,
    ManageThresholdTemplatesDialogModule,
    FormCustomFieldsModule,
    RouterModule.forChild(TankMonitoringAssetWizardRoutes),
    TranslateModule
  ],
  exports: [TankMonitoringAssetWizardComponent],
  entryComponents: [
    LocationWizardDialogComponent,
    ManageThresholdTemplatesDialogComponent,
  ]
})
export class TankMonitoringAssetWizardModule { }
